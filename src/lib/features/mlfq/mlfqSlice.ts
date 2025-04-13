// src/lib/features/mlfq/mlfqSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MlfqQueueConfig, MlfqState, SchedulingAlgorithm } from "@/lib/definitions"; // Assuming enum exists

const generateInitialMlfqState = (numQueues: number = 3): MlfqState => {
  const queuesConfig: MlfqQueueConfig[] = [];
  const queueContents: number[][] = [];
  let currentQuantum = 8;
  for (let i = 0; i < numQueues; i++) {
    queuesConfig.push({
      id: i,
      priority: i,
      algorithm: SchedulingAlgorithm.RR,
      quantum: i === numQueues - 1 ? Infinity : currentQuantum,
    });
    queueContents.push([]);
    if (i < numQueues - 1) {
      currentQuantum *= 2;
    }
  }

  return {
    numQueues: numQueues,
    queuesConfig: queuesConfig,
    queueContents: queueContents,
    processQueueMap: {},
    currentQueueQuantumUsed: {},
  };
};

const initialState: MlfqState = generateInitialMlfqState();

const mlfqSlice = createSlice({
  name: "mlfq",
  initialState,
  reducers: {
    // Action to allow user/system to change the MLFQ setup
    setMlfqConfig(state, action: PayloadAction<{ numQueues: number; baseQuantum?: number }>) {
      const { numQueues, baseQuantum = 8 } = action.payload;
      const newState = generateInitialMlfqState(numQueues);
      // Potentially customize quanta based on baseQuantum if needed here
      let currentQuantum = baseQuantum;
      for (let i = 0; i < numQueues; i++) {
        newState.queuesConfig[i].quantum = i === numQueues - 1 ? Infinity : currentQuantum;
        if (i < numQueues - 1) {
          currentQuantum *= 2;
        }
      }
      // Replace state entirely with the new configuration and reset dynamic parts
      return newState;
    },

    // Places a new process in the highest priority queue (queue 0)
    initializeProcessInMlfq(state, action: PayloadAction<{ processId: number }>) {
      const { processId } = action.payload;
      const highestQueueId = 0;

      // Avoid adding if already present
      if (state.processQueueMap[processId] !== undefined) {
        console.warn(`MLFQ: Process ${processId} already initialized.`);
        return;
      }

      if (state.queueContents[highestQueueId]) {
        state.queueContents[highestQueueId].push(processId);
        state.processQueueMap[processId] = highestQueueId;
        state.currentQueueQuantumUsed[processId] = 0; // Reset quantum used
      } else {
        console.error(`MLFQ: Highest queue ${highestQueueId} does not exist.`);
      }
    },

    // Moves a process between queues (e.g., for demotion)
    moveProcess(state, action: PayloadAction<{ processId: number; targetQueueId: number }>) {
      const { processId, targetQueueId } = action.payload;
      const currentQueueId = state.processQueueMap[processId];

      if (currentQueueId === undefined) {
        console.error(`MLFQ: Cannot move process ${processId}, not found in map.`);
        return;
      }
      if (targetQueueId >= state.numQueues || targetQueueId < 0) {
        console.error(`MLFQ: Invalid target queue ${targetQueueId} for process ${processId}.`);
        return;
      }
      if (currentQueueId === targetQueueId) {
        console.warn(`MLFQ: Process ${processId} already in target queue ${targetQueueId}.`);
        state.currentQueueQuantumUsed[processId] = 0; // Still reset quantum
        return;
      }

      // Remove from current queue contents
      state.queueContents[currentQueueId] = state.queueContents[currentQueueId]?.filter(id => id !== processId) ?? [];

      // Add to target queue contents (at the end)
      state.queueContents[targetQueueId]?.push(processId);

      // Update map
      state.processQueueMap[processId] = targetQueueId;

      // Reset quantum used for the new queue
      state.currentQueueQuantumUsed[processId] = 0;
    },

    // Removes a process entirely from MLFQ tracking (e.g., on completion)
    removeProcessFromMlfq(state, action: PayloadAction<{ processId: number }>) {
      const { processId } = action.payload;
      const currentQueueId = state.processQueueMap[processId];

      if (currentQueueId !== undefined && state.queueContents[currentQueueId]) {
        // Remove from queue contents
        state.queueContents[currentQueueId] = state.queueContents[currentQueueId].filter(id => id !== processId);
      } else {
        console.warn(`MLFQ: Process ${processId} not found in queue ${currentQueueId} for removal.`);
      }

      // Remove from maps
      delete state.processQueueMap[processId];
      delete state.currentQueueQuantumUsed[processId];
    },

    // Removes the process ID from the FRONT of a specific queue's content array
    // Used when a process is selected for execution from that queue
    removeFromMlfqQueueFront(state, action: PayloadAction<{ queueId: number }>) {
      const { queueId } = action.payload;
      if (state.queueContents[queueId] && state.queueContents[queueId].length > 0) {
        state.queueContents[queueId].shift(); // Removes the first element
      } else {
        console.warn(`MLFQ: Attempted to remove from front of empty or non-existent queue ${queueId}.`);
      }
      // Note: This action ONLY modifies queueContents. processQueueMap and currentQueueQuantumUsed
      // are handled by setActiveProcess or other actions when the process actually starts/stops.
    },

    // Moves the process at the front of a queue to the back of the SAME queue
    // Used for cycling in the lowest queue or if a process yields but stays.
    cycleQueue(state, action: PayloadAction<{ queueId: number }>) {
      const { queueId } = action.payload;
      if (state.queueContents[queueId] && state.queueContents[queueId].length > 1) { // Need at least 2 to cycle
        const processId = state.queueContents[queueId].shift(); // Remove from front
        if (processId !== undefined) {
          state.queueContents[queueId].push(processId); // Add to back
        }
      }
      // If only one process, it stays at the front.
    },

    // Increments the quantum counter for a specific process
    incrementQueueQuantumUsed(state, action: PayloadAction<{ processId: number }>) {
      const { processId } = action.payload;
      // Initialize if not present (should ideally be set on add/move)
      const currentUsage = state.currentQueueQuantumUsed[processId] ?? 0;
      state.currentQueueQuantumUsed[processId] = currentUsage + 1;
    },

    // Resets the quantum counter for a specific process
    resetQueueQuantumUsed(state, action: PayloadAction<{ processId: number }>) {
      const { processId } = action.payload;
      state.currentQueueQuantumUsed[processId] = 0;
    },

    // Resets only the dynamic parts of the MLFQ state
    resetMlfqDynamicState(state) {
      state.queueContents = Array.from({ length: state.numQueues }, () => []);
      state.processQueueMap = {};
      state.currentQueueQuantumUsed = {};
    },
  },
});

export const {
  setMlfqConfig,
  initializeProcessInMlfq,
  moveProcess,
  removeProcessFromMlfq,
  removeFromMlfqQueueFront,
  cycleQueue,
  incrementQueueQuantumUsed,
  resetQueueQuantumUsed,
  resetMlfqDynamicState,
} = mlfqSlice.actions;

export default mlfqSlice.reducer;

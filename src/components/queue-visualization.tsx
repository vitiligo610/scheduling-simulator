import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function QueueVisualization() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ready Queue(s)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 border border-dashed rounded-md flex items-center justify-center bg-muted/20">
          <p className="text-muted-foreground">Queue visualization will appear here</p>
        </div>
      </CardContent>
    </Card>
  )
}

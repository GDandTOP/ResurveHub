import { Loader2 } from 'lucide-react'

export function LoadingState () {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    </div>
  )
}

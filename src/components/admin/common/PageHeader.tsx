import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageHeader ({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight font-[family-name:var(--font-noto-sans-kr)] [letter-spacing:-0.03em]">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground font-[family-name:var(--font-noto-sans-kr)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

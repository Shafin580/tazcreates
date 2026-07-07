import { Spinner } from "./Spinner"

interface LoadingOverlayProps {
  loaderText?: string
  isLoading: boolean
  spinnerSize?: number
}

export function LoadingOverlay({ loaderText = "Loading", isLoading, spinnerSize = 40 }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={loaderText}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-2">
        <Spinner size={spinnerSize} />
        <p className="text-sm text-muted-foreground">{loaderText}...</p>
      </div>
    </div>
  )
}
import { Skeleton } from "@/components/ui/skeleton" // If you don't have this, use standard divs with 'animate-pulse'

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-black pt-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start border-b border-white/10 pb-8">
          <div className="h-24 w-24 rounded-full bg-white/5 animate-pulse" />
          <div className="space-y-4 w-full md:w-1/2">
            <div className="h-8 w-3/4 rounded bg-white/5 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-white/5 animate-pulse" />
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse border border-white/10" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="h-64 rounded-xl bg-white/5 animate-pulse border border-white/10" />
      </div>
    </div>
  )
}
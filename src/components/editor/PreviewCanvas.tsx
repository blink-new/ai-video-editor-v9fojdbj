import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Slider } from '../ui/slider'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize,
  Settings
} from 'lucide-react'
import { TimelineTrack } from '../VideoEditor'

interface PreviewCanvasProps {
  timelineTracks: TimelineTrack[]
  currentTime: number
  isPlaying: boolean
  onTimeChange: (time: number) => void
  onPlayPause: () => void
}

export function PreviewCanvas({ 
  timelineTracks, 
  currentTime, 
  isPlaying, 
  onTimeChange, 
  onPlayPause 
}: PreviewCanvasProps) {
  const [volume, setVolume] = useState([100])
  const [duration, setDuration] = useState(60) // Default 60 seconds
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Draw preview content
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw placeholder content
    ctx.fillStyle = '#6366f1'
    ctx.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2)

    // Draw time indicator
    ctx.fillStyle = '#f59e0b'
    ctx.font = '24px Inter'
    ctx.textAlign = 'center'
    ctx.fillText(formatTime(currentTime), canvas.width / 2, canvas.height / 2)

    // Draw timeline items preview
    timelineTracks.forEach((track, trackIndex) => {
      track.items.forEach((item, itemIndex) => {
        if (currentTime >= item.startTime && currentTime < item.startTime + item.duration) {
          ctx.fillStyle = track.type === 'video' ? '#3b82f6' : '#10b981'
          ctx.fillRect(
            20 + itemIndex * 10, 
            20 + trackIndex * 30, 
            100, 
            20
          )
          
          ctx.fillStyle = '#ffffff'
          ctx.font = '12px Inter'
          ctx.textAlign = 'left'
          ctx.fillText(`${track.type} ${itemIndex + 1}`, 25 + itemIndex * 10, 35 + trackIndex * 30)
        }
      })
    })
  }, [currentTime, timelineTracks])

  return (
    <div className="h-full bg-card flex flex-col">
      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="block max-w-full max-h-full"
            style={{ aspectRatio: '16/9' }}
          />
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={onPlayPause}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full w-16 h-16"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </div>

          {/* Resolution Indicator */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            1920x1080
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border bg-card">
        {/* Timeline Scrubber */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            onValueChange={([value]) => onTimeChange(value)}
            max={duration}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTimeChange(Math.max(0, currentTime - 10))}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onPlayPause}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTimeChange(Math.min(duration, currentTime + 10))}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-20"
            />
            <span className="text-xs text-muted-foreground w-8">
              {volume[0]}%
            </span>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
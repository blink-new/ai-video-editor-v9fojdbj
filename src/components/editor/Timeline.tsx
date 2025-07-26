import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Slider } from '../ui/slider'
import { 
  ZoomIn, 
  ZoomOut, 
  Scissors, 
  Copy, 
  Trash2,
  Volume2,
  VolumeX
} from 'lucide-react'
import { TimelineTrack, TimelineItem } from '../VideoEditor'

interface TimelineProps {
  tracks: TimelineTrack[]
  currentTime: number
  selectedItem: TimelineItem | null
  onTimeChange: (time: number) => void
  onItemSelect: (item: TimelineItem | null) => void
  onTracksChange: (tracks: TimelineTrack[]) => void
}

export function Timeline({ 
  tracks, 
  currentTime, 
  selectedItem, 
  onTimeChange, 
  onItemSelect, 
  onTracksChange 
}: TimelineProps) {
  const [zoom, setZoom] = useState([50])
  const [isDragging, setIsDragging] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const pixelsPerSecond = zoom[0] * 2 // Zoom factor

  // Format time for ruler
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Generate time ruler marks
  const generateRulerMarks = () => {
    const marks = []
    const duration = 120 // 2 minutes for demo
    const interval = zoom[0] > 30 ? 1 : zoom[0] > 15 ? 5 : 10

    for (let i = 0; i <= duration; i += interval) {
      marks.push(
        <div
          key={i}
          className="absolute flex flex-col items-center"
          style={{ left: `${i * pixelsPerSecond}px` }}
        >
          <div className="w-px h-3 bg-border" />
          <span className="text-xs text-muted-foreground mt-1">
            {formatTime(i)}
          </span>
        </div>
      )
    }
    return marks
  }

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return
    
    const rect = timelineRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const time = x / pixelsPerSecond
    onTimeChange(Math.max(0, time))
  }

  // Handle item drag
  const handleItemDrag = (item: TimelineItem, newStartTime: number) => {
    const updatedTracks = tracks.map(track => ({
      ...track,
      items: track.items.map(trackItem =>
        trackItem.id === item.id
          ? { ...trackItem, startTime: Math.max(0, newStartTime) }
          : trackItem
      )
    }))
    onTracksChange(updatedTracks)
  }

  // Handle item resize
  const handleItemResize = (item: TimelineItem, newDuration: number) => {
    const updatedTracks = tracks.map(track => ({
      ...track,
      items: track.items.map(trackItem =>
        trackItem.id === item.id
          ? { ...trackItem, duration: Math.max(0.1, newDuration) }
          : trackItem
      )
    }))
    onTracksChange(updatedTracks)
  }

  // Delete selected item
  const deleteSelectedItem = () => {
    if (!selectedItem) return
    
    const updatedTracks = tracks.map(track => ({
      ...track,
      items: track.items.filter(item => item.id !== selectedItem.id)
    }))
    onTracksChange(updatedTracks)
    onItemSelect(null)
  }

  return (
    <div className="h-full bg-card border-t border-border flex flex-col">
      {/* Timeline Header */}
      <div className="h-12 bg-secondary/30 border-b border-border flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Timeline</span>
          {selectedItem && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Scissors className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Copy className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-destructive hover:text-destructive"
                onClick={deleteSelectedItem}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <ZoomOut className="w-3 h-3" />
          </Button>
          <Slider
            value={zoom}
            onValueChange={setZoom}
            min={10}
            max={100}
            step={5}
            className="w-20"
          />
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <ZoomIn className="w-3 h-3" />
          </Button>
          <span className="text-xs text-muted-foreground w-8">
            {zoom[0]}%
          </span>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex">
        {/* Track Labels */}
        <div className="w-32 bg-secondary/20 border-r border-border">
          <div className="h-8 border-b border-border" /> {/* Ruler space */}
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="h-16 border-b border-border flex items-center px-3 gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${
                track.type === 'video' ? 'bg-blue-500' : 'bg-green-500'
              }`} />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {track.type === 'video' ? 'Video' : 'Audio'} {index + 1}
                </div>
                <div className="text-xs text-muted-foreground">
                  {track.items.length} items
                </div>
              </div>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
                {track.type === 'audio' ? (
                  <Volume2 className="w-3 h-3" />
                ) : (
                  <VolumeX className="w-3 h-3" />
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Timeline Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="relative" style={{ width: `${120 * pixelsPerSecond}px` }}>
              {/* Time Ruler */}
              <div 
                ref={timelineRef}
                className="h-8 bg-secondary/10 border-b border-border relative cursor-pointer"
                onClick={handleTimelineClick}
              >
                {generateRulerMarks()}
                
                {/* Playhead */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-accent z-10"
                  style={{ left: `${currentTime * pixelsPerSecond}px` }}
                >
                  <div className="absolute -top-1 -left-2 w-4 h-4 bg-accent rotate-45 transform origin-center" />
                </div>
              </div>

              {/* Tracks */}
              {tracks.map((track, trackIndex) => (
                <div
                  key={track.id}
                  className="h-16 border-b border-border relative"
                  onDrop={(e) => {
                    e.preventDefault()
                    const mediaData = e.dataTransfer.getData('application/json')
                    if (mediaData) {
                      const mediaItem = JSON.parse(mediaData)
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const startTime = x / pixelsPerSecond
                      
                      // Add item to timeline
                      const newItem: TimelineItem = {
                        id: `timeline-${Date.now()}-${Math.random()}`,
                        mediaId: mediaItem.id,
                        startTime: Math.max(0, startTime),
                        duration: mediaItem.duration || 5
                      }
                      
                      const updatedTracks = tracks.map(t =>
                        t.id === track.id
                          ? { ...t, items: [...t.items, newItem] }
                          : t
                      )
                      onTracksChange(updatedTracks)
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {track.items.map((item) => (
                    <div
                      key={item.id}
                      className={`absolute top-2 bottom-2 rounded cursor-pointer transition-all ${
                        selectedItem?.id === item.id
                          ? 'ring-2 ring-primary'
                          : 'hover:brightness-110'
                      } ${
                        track.type === 'video'
                          ? 'bg-blue-500/80 hover:bg-blue-500'
                          : 'bg-green-500/80 hover:bg-green-500'
                      }`}
                      style={{
                        left: `${item.startTime * pixelsPerSecond}px`,
                        width: `${item.duration * pixelsPerSecond}px`
                      }}
                      onClick={() => onItemSelect(item)}
                      draggable
                      onDragStart={(e) => {
                        setIsDragging(true)
                        e.dataTransfer.setData('text/plain', item.id)
                      }}
                      onDragEnd={() => setIsDragging(false)}
                    >
                      <div className="p-2 text-white text-xs font-medium truncate">
                        {track.type} Clip
                      </div>
                      
                      {/* Resize handles */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 cursor-ew-resize opacity-0 hover:opacity-100" />
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 cursor-ew-resize opacity-0 hover:opacity-100" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
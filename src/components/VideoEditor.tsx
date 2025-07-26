import { useState, useRef } from 'react'
import { HeaderToolbar } from './editor/HeaderToolbar'
import { MediaLibrary } from './editor/MediaLibrary'
import { PreviewCanvas } from './editor/PreviewCanvas'
import { PropertiesPanel } from './editor/PropertiesPanel'
import { Timeline } from './editor/Timeline'
import { AIAssistant } from './editor/AIAssistant'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

export interface MediaItem {
  id: string
  name: string
  type: 'video' | 'audio' | 'image'
  url: string
  duration?: number
  thumbnail?: string
}

export interface TimelineTrack {
  id: string
  type: 'video' | 'audio'
  items: TimelineItem[]
}

export interface TimelineItem {
  id: string
  mediaId: string
  startTime: number
  duration: number
  trimStart?: number
  trimEnd?: number
  effects?: string[]
}

export function VideoEditor() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [timelineTracks, setTimelineTracks] = useState<TimelineTrack[]>([
    { id: 'video-1', type: 'video', items: [] },
    { id: 'audio-1', type: 'audio', items: [] }
  ])
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileImport = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const mediaItem: MediaItem = {
        id: `media-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : 
              file.type.startsWith('audio/') ? 'audio' : 'image',
        url,
        duration: file.type.startsWith('video/') || file.type.startsWith('audio/') ? 10 : undefined
      }
      setMediaItems(prev => [...prev, mediaItem])
    })
  }

  const addToTimeline = (mediaItem: MediaItem, trackId: string) => {
    const timelineItem: TimelineItem = {
      id: `timeline-${Date.now()}-${Math.random()}`,
      mediaId: mediaItem.id,
      startTime: currentTime,
      duration: mediaItem.duration || 5
    }

    setTimelineTracks(prev => prev.map(track => 
      track.id === trackId 
        ? { ...track, items: [...track.items, timelineItem] }
        : track
    ))
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Toolbar */}
      <HeaderToolbar 
        onImport={() => fileInputRef.current?.click()}
        onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        showAIAssistant={showAIAssistant}
      />

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Media Library */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <MediaLibrary 
              mediaItems={mediaItems}
              onAddToTimeline={addToTimeline}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* Center Panel - Preview and Timeline */}
          <ResizablePanel defaultSize={showAIAssistant ? 50 : 65}>
            <div className="h-full flex flex-col">
              {/* Preview Canvas */}
              <div className="flex-1 min-h-0">
                <PreviewCanvas 
                  timelineTracks={timelineTracks}
                  currentTime={currentTime}
                  isPlaying={isPlaying}
                  onTimeChange={setCurrentTime}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                />
              </div>

              {/* Timeline */}
              <div className="h-64 border-t border-border">
                <Timeline 
                  tracks={timelineTracks}
                  currentTime={currentTime}
                  selectedItem={selectedItem}
                  onTimeChange={setCurrentTime}
                  onItemSelect={setSelectedItem}
                  onTracksChange={setTimelineTracks}
                />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel - Properties and AI Assistant */}
          <ResizablePanel defaultSize={showAIAssistant ? 30 : 15} minSize={15} maxSize={35}>
            <div className="h-full flex flex-col">
              {/* Properties Panel */}
              <div className={showAIAssistant ? "flex-1" : "h-full"}>
                <PropertiesPanel 
                  selectedItem={selectedItem}
                  mediaItems={mediaItems}
                />
              </div>

              {/* AI Assistant Panel */}
              {showAIAssistant && (
                <>
                  <ResizableHandle />
                  <div className="flex-1 min-h-0">
                    <AIAssistant 
                      timelineTracks={timelineTracks}
                      onSuggestion={(suggestion) => {
                        console.log('AI Suggestion:', suggestion)
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,audio/*,image/*"
        className="hidden"
        onChange={(e) => e.target.files && handleFileImport(e.target.files)}
      />
    </div>
  )
}
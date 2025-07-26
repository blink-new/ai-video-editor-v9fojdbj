import { useState } from 'react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  Search, 
  Video, 
  Music, 
  Image, 
  Sparkles,
  Plus,
  MoreVertical
} from 'lucide-react'
import { MediaItem, TimelineTrack } from '../VideoEditor'

interface MediaLibraryProps {
  mediaItems: MediaItem[]
  onAddToTimeline: (mediaItem: MediaItem, trackId: string) => void
}

export function MediaLibrary({ mediaItems, onAddToTimeline }: MediaLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || item.type === activeTab
    return matchesSearch && matchesTab
  })

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'audio': return <Music className="w-4 h-4" />
      case 'image': return <Image className="w-4 h-4" />
      default: return <Video className="w-4 h-4" />
    }
  }

  const getItemColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-500/20 text-blue-400'
      case 'audio': return 'bg-green-500/20 text-green-400'
      case 'image': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-3">Media Library</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 bg-background border-border"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="video" className="text-xs">Video</TabsTrigger>
            <TabsTrigger value="audio" className="text-xs">Audio</TabsTrigger>
            <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Media Items */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No media files</p>
              <p className="text-xs">Import files to get started</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-background rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors cursor-pointer"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/json', JSON.stringify(item))
                }}
              >
                {/* Thumbnail/Icon */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center ${getItemColor(item.type)}`}>
                    {getItemIcon(item.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.type}
                      </Badge>
                      {item.duration && (
                        <span className="text-xs text-muted-foreground">
                          {Math.floor(item.duration)}s
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </div>

                {/* Quick Add Buttons */}
                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onAddToTimeline(item, 'video-1')}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Video Track
                  </Button>
                  {item.type === 'audio' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => onAddToTimeline(item, 'audio-1')}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Audio Track
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* AI Effects Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">AI Effects</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Auto Cut
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Color Grade
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Stabilize
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Enhance
          </Button>
        </div>
      </div>
    </div>
  )
}
import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { 
  Settings, 
  Palette, 
  Volume2, 
  Crop, 
  RotateCw,
  Sparkles,
  Eye,
  EyeOff,
  FlipHorizontal,
  FlipVertical,
  Maximize
} from 'lucide-react'
import { TimelineItem, MediaItem } from '../VideoEditor'

interface PropertiesPanelProps {
  selectedItem: TimelineItem | null
  mediaItems: MediaItem[]
  onItemUpdate: (itemId: string, updates: Partial<TimelineItem>) => void
  onApplyEffect: (effectType: string) => void
}

interface ItemProperties {
  // Transform
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
  opacity: number
  
  // Color
  brightness: number
  contrast: number
  saturation: number
  hue: number
  
  // Audio
  volume: number
  fadeIn: number
  fadeOut: number
  
  // Effects
  blur: number
  sharpen: number
  vignette: number
}

export function PropertiesPanel({ selectedItem, mediaItems, onItemUpdate, onApplyEffect }: PropertiesPanelProps) {
  const [properties, setProperties] = useState<ItemProperties>({
    x: 0, y: 0, width: 100, height: 100, rotation: 0, scaleX: 100, scaleY: 100, opacity: 100,
    brightness: 0, contrast: 0, saturation: 0, hue: 0,
    volume: 100, fadeIn: 0, fadeOut: 0,
    blur: 0, sharpen: 0, vignette: 0
  })
  
  const [activePreset, setActivePreset] = useState<string>('')
  const [isVisible, setIsVisible] = useState(true)
  const [isLocked, setIsLocked] = useState(false)

  const selectedMedia = selectedItem 
    ? mediaItems.find(m => m.id === selectedItem.mediaId)
    : null

  // Update properties when item changes
  useEffect(() => {
    if (selectedItem) {
      // In a real app, load properties from the timeline item
      setProperties({
        x: 0, y: 0, width: 100, height: 100, rotation: 0, scaleX: 100, scaleY: 100, opacity: 100,
        brightness: 0, contrast: 0, saturation: 0, hue: 0,
        volume: 100, fadeIn: 0, fadeOut: 0,
        blur: 0, sharpen: 0, vignette: 0
      })
    }
  }, [selectedItem])

  // Update property and sync with timeline item
  const updateProperty = <K extends keyof ItemProperties>(
    key: K, 
    value: ItemProperties[K]
  ) => {
    setProperties(prev => ({ ...prev, [key]: value }))
    
    if (selectedItem) {
      // In a real app, this would update the actual item properties
      console.log(`Updating ${key} to ${value} for item ${selectedItem.id}`)
    }
  }

  // Apply color preset
  const applyColorPreset = (preset: string) => {
    setActivePreset(preset)
    
    switch (preset) {
      case 'warm':
        updateProperty('brightness', 10)
        updateProperty('contrast', 5)
        updateProperty('saturation', 15)
        updateProperty('hue', 10)
        break
      case 'cool':
        updateProperty('brightness', -5)
        updateProperty('contrast', 10)
        updateProperty('saturation', 5)
        updateProperty('hue', -15)
        break
      case 'vintage':
        updateProperty('brightness', -10)
        updateProperty('contrast', 20)
        updateProperty('saturation', -20)
        updateProperty('hue', 5)
        break
      case 'bw':
        updateProperty('saturation', -100)
        updateProperty('contrast', 15)
        break
      default:
        break
    }
  }

  // Reset properties
  const resetProperties = () => {
    setProperties({
      x: 0, y: 0, width: 100, height: 100, rotation: 0, scaleX: 100, scaleY: 100, opacity: 100,
      brightness: 0, contrast: 0, saturation: 0, hue: 0,
      volume: 100, fadeIn: 0, fadeOut: 0,
      blur: 0, sharpen: 0, vignette: 0
    })
    setActivePreset('')
  }

  // Quick transform actions
  const flipHorizontal = () => {
    updateProperty('scaleX', properties.scaleX * -1)
  }

  const flipVertical = () => {
    updateProperty('scaleY', properties.scaleY * -1)
  }

  const rotate90 = () => {
    updateProperty('rotation', (properties.rotation + 90) % 360)
  }

  const fitToScreen = () => {
    updateProperty('width', 100)
    updateProperty('height', 100)
    updateProperty('x', 0)
    updateProperty('y', 0)
  }

  if (!selectedItem || !selectedMedia) {
    return (
      <div className="h-full bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-center p-4">
          <div className="text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No item selected</p>
            <p className="text-xs">Select a timeline item to edit properties</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={resetProperties}
            >
              <RotateCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {selectedMedia.type}
          </Badge>
          <span className="text-xs text-muted-foreground truncate">
            {selectedMedia.name}
          </span>
        </div>

        {/* Item Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Switch 
              checked={isVisible} 
              onCheckedChange={setIsVisible}
              className="scale-75"
            />
            <span>Visible</span>
          </div>
          <div className="flex items-center gap-1">
            <Switch 
              checked={isLocked} 
              onCheckedChange={setIsLocked}
              className="scale-75"
            />
            <span>Locked</span>
          </div>
        </div>
      </div>

      {/* Properties Tabs */}
      <ScrollArea className="flex-1">
        <Tabs defaultValue="transform" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
            <TabsTrigger value="transform" className="text-xs">Transform</TabsTrigger>
            <TabsTrigger value="color" className="text-xs">Color</TabsTrigger>
            <TabsTrigger value="audio" className="text-xs">Audio</TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">Effects</TabsTrigger>
          </TabsList>

          <div className="p-4">
            {/* Transform Tab */}
            <TabsContent value="transform" className="space-y-4 mt-4">
              {/* Position */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">X</Label>
                    <Input 
                      type="number" 
                      value={properties.x}
                      onChange={(e) => updateProperty('x', parseFloat(e.target.value) || 0)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <Input 
                      type="number" 
                      value={properties.y}
                      onChange={(e) => updateProperty('y', parseFloat(e.target.value) || 0)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Scale */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Scale (%)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Width</Label>
                    <Input 
                      type="number" 
                      value={properties.scaleX}
                      onChange={(e) => updateProperty('scaleX', parseFloat(e.target.value) || 100)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Height</Label>
                    <Input 
                      type="number" 
                      value={properties.scaleY}
                      onChange={(e) => updateProperty('scaleY', parseFloat(e.target.value) || 100)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Rotation</Label>
                  <span className="text-xs text-muted-foreground">{properties.rotation}°</span>
                </div>
                <Slider
                  value={[properties.rotation]}
                  onValueChange={([value]) => updateProperty('rotation', value)}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Opacity</Label>
                  <span className="text-xs text-muted-foreground">{properties.opacity}%</span>
                </div>
                <Slider
                  value={[properties.opacity]}
                  onValueChange={([value]) => updateProperty('opacity', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Quick Actions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={flipHorizontal}>
                    <FlipHorizontal className="w-3 h-3 mr-1" />
                    Flip H
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={flipVertical}>
                    <FlipVertical className="w-3 h-3 mr-1" />
                    Flip V
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={rotate90}>
                    <RotateCw className="w-3 h-3 mr-1" />
                    Rotate 90°
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs" onClick={fitToScreen}>
                    <Maximize className="w-3 h-3 mr-1" />
                    Fit Screen
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Color Tab */}
            <TabsContent value="color" className="space-y-4 mt-4">
              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Brightness</Label>
                  <span className="text-xs text-muted-foreground">{properties.brightness}</span>
                </div>
                <Slider
                  value={[properties.brightness]}
                  onValueChange={([value]) => updateProperty('brightness', value)}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Contrast</Label>
                  <span className="text-xs text-muted-foreground">{properties.contrast}</span>
                </div>
                <Slider
                  value={[properties.contrast]}
                  onValueChange={([value]) => updateProperty('contrast', value)}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Saturation</Label>
                  <span className="text-xs text-muted-foreground">{properties.saturation}</span>
                </div>
                <Slider
                  value={[properties.saturation]}
                  onValueChange={([value]) => updateProperty('saturation', value)}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Hue */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Hue</Label>
                  <span className="text-xs text-muted-foreground">{properties.hue}°</span>
                </div>
                <Slider
                  value={[properties.hue]}
                  onValueChange={([value]) => updateProperty('hue', value)}
                  min={-180}
                  max={180}
                  step={1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Color Presets */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Presets</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={activePreset === 'warm' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => applyColorPreset('warm')}
                  >
                    Warm
                  </Button>
                  <Button 
                    variant={activePreset === 'cool' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => applyColorPreset('cool')}
                  >
                    Cool
                  </Button>
                  <Button 
                    variant={activePreset === 'vintage' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => applyColorPreset('vintage')}
                  >
                    Vintage
                  </Button>
                  <Button 
                    variant={activePreset === 'bw' ? 'default' : 'outline'} 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => applyColorPreset('bw')}
                  >
                    B&W
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Audio Tab */}
            <TabsContent value="audio" className="space-y-4 mt-4">
              {/* Volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Volume</Label>
                  <span className="text-xs text-muted-foreground">{properties.volume}%</span>
                </div>
                <Slider
                  value={[properties.volume]}
                  onValueChange={([value]) => updateProperty('volume', value)}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Fade */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Fade</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Fade In (s)</Label>
                    <Input 
                      type="number" 
                      value={properties.fadeIn}
                      onChange={(e) => updateProperty('fadeIn', parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Fade Out (s)</Label>
                    <Input 
                      type="number" 
                      value={properties.fadeOut}
                      onChange={(e) => updateProperty('fadeOut', parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Audio Effects */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Effects</Label>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-xs justify-start"
                    onClick={() => onApplyEffect('noise-reduce')}
                  >
                    <Volume2 className="w-3 h-3 mr-2" />
                    Noise Reduction
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-xs justify-start"
                    onClick={() => onApplyEffect('echo')}
                  >
                    <Volume2 className="w-3 h-3 mr-2" />
                    Echo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-xs justify-start"
                    onClick={() => onApplyEffect('reverb')}
                  >
                    <Volume2 className="w-3 h-3 mr-2" />
                    Reverb
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Effects Tab */}
            <TabsContent value="effects" className="space-y-4 mt-4">
              {/* Blur */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Blur</Label>
                  <span className="text-xs text-muted-foreground">{properties.blur}px</span>
                </div>
                <Slider
                  value={[properties.blur]}
                  onValueChange={([value]) => updateProperty('blur', value)}
                  min={0}
                  max={20}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Sharpen */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Sharpen</Label>
                  <span className="text-xs text-muted-foreground">{properties.sharpen}</span>
                </div>
                <Slider
                  value={[properties.sharpen]}
                  onValueChange={([value]) => updateProperty('sharpen', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Vignette */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground">Vignette</Label>
                  <span className="text-xs text-muted-foreground">{properties.vignette}%</span>
                </div>
                <Slider
                  value={[properties.vignette]}
                  onValueChange={([value]) => updateProperty('vignette', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Effect Presets */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground">Effect Presets</Label>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-xs justify-start"
                    onClick={() => onApplyEffect('stabilize')}
                  >
                    Stabilization
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-xs justify-start"
                    onClick={() => onApplyEffect('slow-motion')}
                  >
                    Slow Motion
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 text-xs justify-start"
                    onClick={() => onApplyEffect('time-lapse')}
                  >
                    Time Lapse
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </ScrollArea>

      {/* AI Enhancement */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full h-8 text-xs bg-accent/10 border-accent/20 hover:bg-accent/20"
          onClick={() => onApplyEffect('ai-enhance')}
        >
          <Sparkles className="w-3 h-3 mr-2" />
          AI Enhance Selected
        </Button>
      </div>
    </div>
  )
}
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { 
  Upload, 
  Download, 
  Sparkles, 
  Undo, 
  Redo, 
  Save,
  Settings,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react'

interface HeaderToolbarProps {
  onImport: () => void
  onToggleAI: () => void
  showAIAssistant: boolean
}

export function HeaderToolbar({ onImport, onToggleAI, showAIAssistant }: HeaderToolbarProps) {
  return (
    <div className="h-14 bg-card border-b border-border flex items-center px-4 gap-2">
      {/* Logo/Title */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-semibold text-foreground">AI Video Editor</h1>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* File Operations */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onImport}
          className="text-foreground hover:bg-secondary"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Edit Operations */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Playback Controls */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <Play className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* AI Assistant Toggle */}
      <Button 
        variant={showAIAssistant ? "default" : "ghost"}
        size="sm"
        onClick={onToggleAI}
        className={showAIAssistant ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        AI Assistant
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Settings */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <Save className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-foreground hover:bg-secondary"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
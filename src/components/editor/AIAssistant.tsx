import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Sparkles, 
  Send, 
  Wand2, 
  Zap, 
  Scissors, 
  Palette,
  Volume2,
  TrendingUp,
  Bot,
  Lightbulb,
  Target,
  Clock
} from 'lucide-react'
import { TimelineTrack, MediaItem } from '../VideoEditor'

interface AIAssistantProps {
  timelineTracks: TimelineTrack[]
  mediaItems: MediaItem[]
  onSuggestion: (suggestion: string) => void
  onAddToTimeline: (mediaItem: MediaItem, trackId: string, startTime?: number) => void
}

interface AIMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: AISuggestion[]
}

interface AISuggestion {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: string
  confidence: number
  estimatedTime: string
}

interface AIAnalysis {
  totalClips: number
  totalDuration: number
  videoClips: number
  audioClips: number
  suggestions: AISuggestion[]
}

export function AIAssistant({ timelineTracks, mediaItems, onSuggestion, onAddToTimeline }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI video editing assistant. I can analyze your timeline, suggest improvements, and automate tedious tasks. What would you like me to help you with?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('chat')

  // Analyze timeline and generate suggestions
  const analyzeTimeline = (): AIAnalysis => {
    const totalClips = timelineTracks.reduce((acc, track) => acc + track.items.length, 0)
    const totalDuration = Math.max(
      ...timelineTracks.flatMap(track => 
        track.items.map(item => item.startTime + item.duration)
      ),
      0
    )
    const videoClips = timelineTracks.filter(t => t.type === 'video').reduce((acc, track) => acc + track.items.length, 0)
    const audioClips = timelineTracks.filter(t => t.type === 'audio').reduce((acc, track) => acc + track.items.length, 0)

    const suggestions: AISuggestion[] = []

    // Generate contextual suggestions based on timeline content
    if (totalClips > 0) {
      suggestions.push({
        id: 'auto-cut',
        title: 'Auto Cut Silence',
        description: `Remove silent parts from ${audioClips} audio clips`,
        icon: <Scissors className="w-4 h-4" />,
        action: 'auto-cut',
        confidence: 85,
        estimatedTime: '2-3 min'
      })
    }

    if (videoClips > 0) {
      suggestions.push({
        id: 'color-grade',
        title: 'Color Correction',
        description: `Apply cinematic grading to ${videoClips} video clips`,
        icon: <Palette className="w-4 h-4" />,
        action: 'color-grade',
        confidence: 92,
        estimatedTime: '1-2 min'
      })
    }

    if (totalClips > 3) {
      suggestions.push({
        id: 'transitions',
        title: 'Smart Transitions',
        description: 'Add smooth transitions between clips',
        icon: <Zap className="w-4 h-4" />,
        action: 'transitions',
        confidence: 78,
        estimatedTime: '30 sec'
      })
    }

    if (audioClips > 0) {
      suggestions.push({
        id: 'audio-enhance',
        title: 'Audio Enhancement',
        description: 'Improve audio quality and normalize levels',
        icon: <Volume2 className="w-4 h-4" />,
        action: 'audio-enhance',
        confidence: 88,
        estimatedTime: '1 min'
      })
    }

    suggestions.push({
      id: 'auto-captions',
      title: 'Generate Captions',
      description: 'Create subtitles automatically',
      icon: <Wand2 className="w-4 h-4" />,
      action: 'captions',
      confidence: 95,
      estimatedTime: '3-5 min'
    })

    return {
      totalClips,
      totalDuration,
      videoClips,
      audioClips,
      suggestions
    }
  }

  const analysis = analyzeTimeline()

  const getAIResponse = (input: string): { content: string, suggestions?: AISuggestion[] } => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('analyze') || lowerInput.includes('suggest')) {
      return {
        content: `I've analyzed your timeline with ${analysis.totalClips} clips. Here are my top recommendations based on your content:`,
        suggestions: analysis.suggestions.slice(0, 3)
      }
    }
    
    if (lowerInput.includes('cut') || lowerInput.includes('trim')) {
      return {
        content: 'I can help you cut your video! I\'ve detected several areas where automatic cutting would improve pacing. Should I proceed with removing silent sections and optimizing clip lengths?',
        suggestions: [analysis.suggestions.find(s => s.id === 'auto-cut')].filter(Boolean) as AISuggestion[]
      }
    }
    
    if (lowerInput.includes('color') || lowerInput.includes('grade')) {
      return {
        content: 'Great choice! I can apply professional color grading to enhance your video\'s visual appeal. I recommend a cinematic look that will make your content more engaging.',
        suggestions: [analysis.suggestions.find(s => s.id === 'color-grade')].filter(Boolean) as AISuggestion[]
      }
    }
    
    if (lowerInput.includes('audio') || lowerInput.includes('sound')) {
      return {
        content: 'I can significantly improve your audio quality! I\'ll reduce background noise, normalize volume levels, and apply professional EQ settings.',
        suggestions: [analysis.suggestions.find(s => s.id === 'audio-enhance')].filter(Boolean) as AISuggestion[]
      }
    }
    
    if (lowerInput.includes('transition')) {
      return {
        content: 'I\'ll add smooth, professional transitions between your clips. This will create better flow and make your video more polished.',
        suggestions: [analysis.suggestions.find(s => s.id === 'transitions')].filter(Boolean) as AISuggestion[]
      }
    }

    if (lowerInput.includes('caption') || lowerInput.includes('subtitle')) {
      return {
        content: 'I can generate accurate captions for your video automatically. This will make your content more accessible and improve engagement.',
        suggestions: [analysis.suggestions.find(s => s.id === 'auto-captions')].filter(Boolean) as AISuggestion[]
      }
    }
    
    return {
      content: 'I understand you want to improve your video. Let me analyze your timeline and suggest the best enhancements based on your content.',
      suggestions: analysis.suggestions.slice(0, 2)
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)
    setProcessingProgress(0)

    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 20
      })
    }, 300)

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(inputValue)
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions
      }
      setMessages(prev => [...prev, aiResponse])
      setIsProcessing(false)
      setProcessingProgress(0)
      clearInterval(progressInterval)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `✨ Applying ${suggestion.title}... This will take approximately ${suggestion.estimatedTime}. I'll optimize your content for the best results.`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, aiMessage])
    onSuggestion(suggestion.action)

    // Simulate completion message
    setTimeout(() => {
      const completionMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `✅ ${suggestion.title} completed successfully! Your video has been enhanced. You can see the changes in your timeline.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, completionMessage])
    }, 3000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Intelligent editing suggestions</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
          <TabsTrigger value="suggestions" className="text-xs">Suggestions</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">Analysis</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Suggestions in message */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion) => (
                          <Button
                            key={suggestion.id}
                            variant="outline"
                            size="sm"
                            className="w-full h-auto p-2 flex items-start gap-2 bg-background/50 hover:bg-background/80"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {suggestion.icon}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-xs font-medium">{suggestion.title}</div>
                              <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {suggestion.confidence}% confidence
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {suggestion.estimatedTime}
                                </span>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs opacity-70 mt-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground rounded-lg p-3 max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">AI is analyzing...</span>
                    </div>
                    <Progress value={processingProgress} className="w-full h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Processing your request ({processingProgress}%)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Ask AI for help..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 h-9 text-sm"
                disabled={isProcessing}
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="h-9 w-9 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="flex-1 mt-4">
          <ScrollArea className="h-full px-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-medium">Smart Suggestions</h3>
              </div>
              
              {analysis.suggestions.map((suggestion) => (
                <Button
                  key={suggestion.id}
                  variant="outline"
                  className="w-full h-auto p-3 flex items-start gap-3 hover:bg-accent/10"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{suggestion.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {suggestion.description}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.confidence}% confidence
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {suggestion.estimatedTime}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 mt-4">
          <ScrollArea className="h-full px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-medium">Timeline Analysis</h3>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-foreground">
                    {analysis.totalClips}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Clips</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-foreground">
                    {formatDuration(analysis.totalDuration)}
                  </div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-foreground">
                    {analysis.videoClips}
                  </div>
                  <div className="text-xs text-muted-foreground">Video Clips</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-lg font-semibold text-foreground">
                    {analysis.audioClips}
                  </div>
                  <div className="text-xs text-muted-foreground">Audio Clips</div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Recommendations</h4>
                <div className="space-y-2">
                  {analysis.totalClips === 0 && (
                    <div className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-3">
                      Import media files to get started with AI analysis and suggestions.
                    </div>
                  )}
                  {analysis.totalClips > 0 && analysis.totalClips < 3 && (
                    <div className="text-sm text-muted-foreground bg-blue-500/10 rounded-lg p-3">
                      Add more clips to unlock advanced AI features like smart transitions and batch processing.
                    </div>
                  )}
                  {analysis.videoClips > 0 && (
                    <div className="text-sm text-muted-foreground bg-green-500/10 rounded-lg p-3">
                      Your video content is ready for color grading and visual enhancement.
                    </div>
                  )}
                  {analysis.audioClips > 0 && (
                    <div className="text-sm text-muted-foreground bg-purple-500/10 rounded-lg p-3">
                      Audio enhancement will significantly improve your video quality.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Status */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs text-muted-foreground">AI Ready</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {analysis.totalClips} clips analyzed
          </Badge>
        </div>
      </div>
    </div>
  )
}
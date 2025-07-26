import { useState } from 'react'
import { VideoEditor } from './components/VideoEditor'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <div className="h-screen w-full bg-background text-foreground overflow-hidden">
      <VideoEditor />
      <Toaster />
    </div>
  )
}

export default App
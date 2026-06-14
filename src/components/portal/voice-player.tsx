import { useState, useRef, useEffect } from 'react'
import { PlayIcon, PauseIcon, Loader2Icon } from 'lucide-react'
import { SupabaseClient } from '@supabase/supabase-js'

export function VoicePlayer({ filePath, duration, supabase }: { filePath: string, duration: number, supabase: SupabaseClient }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlayPause = async () => {
    if (!signedUrl) {
      setIsLoading(true)
      const { data, error } = await supabase.storage.from('files').createSignedUrl(filePath, 60 * 60 * 24)
      setIsLoading(false)
      if (error || !data) {
        console.error('Failed to get signed URL', error)
        return
      }
      setSignedUrl(data.signedUrl)
    } else {
      togglePlay()
    }
  }

  useEffect(() => {
    if (signedUrl && audioRef.current && !isPlaying) {
      audioRef.current.play().catch(e => console.error('Audio play error:', e))
      setIsPlaying(true)
    }
  }, [signedUrl, isPlaying])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) {
      audioRef.current.play().catch(console.error)
      setIsPlaying(true)
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const formatSecs = (s: number) => {
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 rounded-lg p-2 mt-1 min-w-[200px]">
      <button 
        onClick={handlePlayPause} 
        disabled={isLoading} 
        className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
      >
        {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : (isPlaying ? <PauseIcon className="h-4 w-4 fill-current" /> : <PlayIcon className="h-4 w-4 ml-0.5 fill-current" />)}
      </button>
      <div className="flex-1">
        <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full w-full overflow-hidden">
           <div className="h-full bg-primary w-0" />
        </div>
      </div>
      <span className="text-xs font-medium tabular-nums">{formatSecs(duration)}</span>
      {signedUrl && <audio ref={audioRef} src={signedUrl} onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} className="hidden" />}
    </div>
  )
}

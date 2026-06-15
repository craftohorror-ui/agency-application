import { useState, useRef, useEffect } from 'react'
import { PlayIcon, PauseIcon, Loader2Icon } from 'lucide-react'
import { SupabaseClient } from '@supabase/supabase-js'

export function VoicePlayer({ filePath, duration, supabase }: { filePath: string, duration: number, supabase: SupabaseClient }) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
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
    if (signedUrl && audioRef.current && !isPlaying && currentTime === 0) {
      audioRef.current.play().catch(e => console.error('Audio play error:', e))
      setIsPlaying(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedUrl]) // Run only when signedUrl is generated

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
    if (isNaN(s)) s = 0
    const mins = Math.floor(s / 60)
    const secs = Math.floor(s % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setCurrentTime(val)
    if (audioRef.current) {
      audioRef.current.currentTime = val
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className="flex items-center gap-3 mt-0.5 min-w-[220px]">
      <button 
        type="button"
        onClick={handlePlayPause} 
        disabled={isLoading} 
        className="h-10 w-10 shrink-0 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors flex items-center justify-center text-current shadow-sm"
      >
        {isLoading ? (
          <Loader2Icon className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <PauseIcon className="h-5 w-5 fill-current" />
        ) : (
          <PlayIcon className="h-5 w-5 ml-0.5 fill-current" />
        )}
      </button>
      
      <div className="flex-1 flex flex-col justify-center">
        {isLoading && !signedUrl ? (
          <div className="text-xs opacity-70 font-medium">Loading audio...</div>
        ) : (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center relative w-full h-5">
              <input 
                type="range" 
                min={0} 
                max={duration || 1} 
                step={0.01} 
                value={currentTime} 
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-1.5 bg-black/10 dark:bg-white/10 rounded-full w-full overflow-hidden pointer-events-none">
                 <div 
                   className="h-full bg-current transition-all duration-75" 
                   style={{ width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }}
                 />
              </div>
              <div 
                className="absolute h-3 w-3 bg-current rounded-full pointer-events-none transform -translate-x-1/2 transition-all duration-75 shadow-sm"
                style={{ left: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] tabular-nums font-medium opacity-70 leading-none">
              <span>{formatSecs(currentTime)}</span>
              <span>{formatSecs(duration)}</span>
            </div>
          </div>
        )}
      </div>

      {signedUrl && (
        <audio 
          ref={audioRef} 
          src={signedUrl} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded} 
          onPause={() => setIsPlaying(false)} 
          onPlay={() => setIsPlaying(true)}
          className="hidden" 
        />
      )}
    </div>
  )
}

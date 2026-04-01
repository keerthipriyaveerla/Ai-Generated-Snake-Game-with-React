import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "CYBER_HORIZON.WAV",
    artist: "AI_GEN_ALPHA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "GRID_RUNNER.FLAC",
    artist: "AI_GEN_BETA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "ETERNITY_LOOP.OGG",
    artist: "AI_GEN_GAMMA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  return (
    <div className="bg-black border-2 border-[#FF00FF] p-4 font-digital text-xl relative shadow-[inset_0_0_20px_rgba(255,0,255,0.2)]">
      <div className="absolute top-0 right-0 bg-[#FF00FF] text-black px-2 text-sm font-bold border-b-2 border-l-2 border-[#FF00FF]">
        AUDIO_SYS_v2.4
      </div>

      <audio 
        ref={audioRef} 
        src={track.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="mb-6 mt-6 border-2 border-[#00FFFF] p-3 bg-[#001111] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,255,255,0.1)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
        <h3 className="text-[#00FFFF] font-pixel text-[10px] md:text-xs mb-3 truncate leading-relaxed">
          &gt; {track.title}
        </h3>
        <p className="text-[#FF00FF] text-lg">AUTHOR: {track.artist}</p>
        <p className="text-[#00FFFF] text-lg animate-pulse mt-1">
          STATUS: {isPlaying ? 'STREAMING_DATA...' : 'IDLE_MODE'}
        </p>
      </div>

      {/* Blocky Progress Bar */}
      <div className="h-6 w-full border-2 border-[#FF00FF] bg-black mb-6 flex relative">
        <div 
          className="h-full bg-[#00FFFF] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-sm mix-blend-difference pointer-events-none">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-t-2 border-b-2 border-[#00FFFF] py-3">
          <button 
            onClick={prevTrack} 
            className="text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black px-3 py-1 transition-none"
          >
            [ &lt;&lt; ]
          </button>
          <button 
            onClick={togglePlay} 
            className="text-[#00FFFF] hover:bg-[#00FFFF] hover:text-black px-4 font-pixel text-xs py-3 border-2 border-[#00FFFF] transition-none shadow-[2px_2px_0px_#FF00FF] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
          >
            {isPlaying ? '[ PAUSE ]' : '[ PLAY ]'}
          </button>
          <button 
            onClick={nextTrack} 
            className="text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black px-3 py-1 transition-none"
          >
            [ &gt;&gt; ]
          </button>
        </div>

        <div className="flex items-center gap-4 text-lg bg-[#110011] p-2 border border-[#FF00FF]">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-[#FF00FF] hover:bg-[#FF00FF] hover:text-black px-2 py-1 whitespace-nowrap"
          >
            {isMuted || volume === 0 ? 'VOL: MUTED' : 'VOL: ACTIVE'}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-full h-3 border-2 border-[#00FFFF] appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #FF00FF 0%, #FF00FF ${(isMuted ? 0 : volume) * 100}%, #000 ${(isMuted ? 0 : volume) * 100}%, #000 100%)`
            }}
          />
        </div>
      </div>
    </div>
  );
}

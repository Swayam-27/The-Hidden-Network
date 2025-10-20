import React, { useState, useRef, useEffect } from 'react';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const AudioPlayer = ({ src, caseTitle }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    }
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const progressBar = progressBarRef.current;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newTime = (clickPosition / progressBar.offsetWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!src) {
    return <div className="media-embed"><p>[Audio Not Available]</p></div>;
  }

  return (
    <div className="custom-audio-player">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div className="player-controls">
        <button onClick={togglePlayPause} className="play-pause-btn">
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.016 5.016h3.984v13.969h-3.984v-13.969zM6 18.984v-13.969h3.984v13.969h-3.984z"></path></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.016 5.016l10.969 6.984-10.969 6.984v-13.969z"></path></svg>
          )}
        </button>
        
        <div className="player-info">
          <p className="track-title">CIPHER // {caseTitle}: AUDIO BRIEFING</p>
          <p className={`status-text ${isPlaying ? 'streaming' : ''}`}>STATUS: {isPlaying ? 'STREAMING...' : 'STANDBY'}</p>
        </div>
        
        <div className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</div>
      </div>

      <div className="progress-bar-wrapper" ref={progressBarRef} onClick={handleProgressChange}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default AudioPlayer;
import React, { useState, useEffect, useRef } from 'react';

const ComingSoonPlaceholder = () => (
 <div className="coming-soon-placeholder">
   <p>// AUDIO DEBRIEFING PENDING //</p>
   <p>COMING SOON</p>
 </div>
);

const AudioPlayer = ({ src, caseTitle, episodeTitle }) => {
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
   };
   const setAudioTime = () => setCurrentTime(audio.currentTime);
   audio.addEventListener('loadeddata', setAudioData);
   audio.addEventListener('timeupdate', setAudioTime);
   audio.addEventListener('ended', () => setIsPlaying(false));
   return () => {
     if (audio) {
       audio.removeEventListener('loadeddata', setAudioData);
       audio.removeEventListener('timeupdate', setAudioTime);
       audio.removeEventListener('ended', () => setIsPlaying(false));
     }
   };
 }, [src]);

 const togglePlayPause = () => {
   if (!src) return;
   if (isPlaying) {
     audioRef.current.pause();
   } else {
     audioRef.current.play();
   }
   setIsPlaying(!isPlaying);
 };

 const handleProgressChange = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;

    if (isFinite(newTime)) {
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }
 };

 const formatTime = (time) => {
   if (isNaN(time) || time === 0) return "0:00";
   const minutes = Math.floor(time / 60);
   const seconds = Math.floor(time % 60).toString().padStart(2, '0');
   return `${minutes}:${seconds}`;
 };

 const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
 const trackDisplayTitle = episodeTitle ? episodeTitle.toUpperCase() : "AUDIO BRIEFING";

 if (!src) {
   return <ComingSoonPlaceholder />;
 }

 return (
   <div className="custom-audio-player-wrapper cursor-target" onClick={togglePlayPause}>
     <div className="custom-audio-player">
       <audio ref={audioRef} src={src} preload="metadata" onEnded={() => setIsPlaying(false)} />
       <div className="player-controls">
         <button className="play-pause-btn" disabled={!src}>
           {isPlaying ? (
             <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 19h4V5h-4v14zm-8 0h4V5H6v14z"></path></svg>
           ) : (
             <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
           )}
         </button>
         <div className="player-info">
           <p className="track-title">{caseTitle.toUpperCase()}: {trackDisplayTitle}</p>
           <p className={`status-text ${isPlaying && src ? 'streaming' : ''}`}>STATUS: {isPlaying ? 'STREAMING...' : 'STANDBY'}</p>
         </div>
         <div className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</div>
       </div>
       <div className="progress-bar-wrapper" ref={progressBarRef} onClick={(e) => {
         e.stopPropagation();
         if (src) handleProgressChange(e);
       }}>
         <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
       </div>
     </div>
   </div>
 );
};

export default React.memo(AudioPlayer);
import { useState, useCallback, useRef, useEffect } from 'react';
import { PlaylistVideo, Video } from '@/types';

export const usePlaylist = () => {
  const [playlist, setPlaylist] = useState<PlaylistVideo[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<PlaylistVideo | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(-1);
  const [replayCounter, setReplayCounter] = useState(0);
  const playedLoopsRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addVideo = useCallback((video: Video) => {
    const newVideo: PlaylistVideo = { ...video, loop: 1, duration: 60 };
    setPlaylist((prev) => [...prev, newVideo]);
  }, []);

  const removeVideo = useCallback((index: number) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index));
    if (index === currentVideoIndex) {
      setCurrentlyPlaying(null);
      setCurrentVideoIndex(-1);
    } else if (index < currentVideoIndex) {
      setCurrentVideoIndex((i) => i - 1);
    }
  }, [currentVideoIndex]);

  const updateVideo = useCallback((index: number, updatedVideo: Partial<PlaylistVideo>) => {
    setPlaylist((prev) => {
      const next = prev.map((video, i) => {
        if (i !== index) return video;
        const merged: PlaylistVideo = { ...video, ...updatedVideo } as PlaylistVideo;
        // sanitize values
        if (typeof merged.loop === 'number') {
          if (!Number.isFinite(merged.loop) || merged.loop < 1) merged.loop = 1;
          merged.loop = Math.floor(merged.loop);
        }
        if (typeof merged.duration === 'number') {
          if (!Number.isFinite(merged.duration) || merged.duration < 1) merged.duration = 1;
          merged.duration = Math.floor(merged.duration);
        }
        return merged;
      });

      // If updating the currently playing video settings, restart loop counter to respect new config
      if (index === currentVideoIndex) {
        playedLoopsRef.current = 0;
        setReplayCounter((c) => c + 1);
      }

      return next;
    });
  }, [currentVideoIndex]);

  const playVideo = useCallback((index: number) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentlyPlaying(playlist[index]);
      setCurrentVideoIndex(index);
      playedLoopsRef.current = 0;
      setReplayCounter(c => c + 1);
    }
  }, [playlist]);

  const playNext = useCallback(() => {
    if (playlist.length > 0) {
      const nextIndex = (currentVideoIndex + 1) % playlist.length;
      if (nextIndex === 0 && currentVideoIndex === playlist.length - 1) {
        setCurrentlyPlaying(null);
        setCurrentVideoIndex(-1);
        return;
      }
      playVideo(nextIndex);
    }
  }, [currentVideoIndex, playlist.length, playVideo]);

  const playPrev = useCallback(() => {
    if (playlist.length > 0) {
      const prevIndex = (currentVideoIndex - 1 + playlist.length) % playlist.length;
      playVideo(prevIndex);
    }
  }, [currentVideoIndex, playlist.length, playVideo]);

  const restart = useCallback(() => {
    setCurrentlyPlaying(null);
    setCurrentVideoIndex(-1);
  }, []);

  const clearAll = useCallback(() => {
    setPlaylist([]);
    setCurrentlyPlaying(null);
    setCurrentVideoIndex(-1);
  }, []);

  useEffect(() => {
    // Restore from localStorage on mount (client only)
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('botana:playlist') : null;
      if (raw) {
        const parsed = JSON.parse(raw) as PlaylistVideo[];
        if (Array.isArray(parsed)) {
          setPlaylist(parsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Persist playlist
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('botana:playlist', JSON.stringify(playlist));
      }
    } catch {}
  }, [playlist]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (currentVideoIndex === -1 || !currentlyPlaying) {
      return;
    }

    const video = playlist[currentVideoIndex];
    if (!video) return;

    const { loop, duration } = video;

    timerRef.current = setTimeout(() => {
      if (playedLoopsRef.current < loop - 1) {
        playedLoopsRef.current += 1;
        setReplayCounter(c => c + 1);
      } else {
        playNext();
      }
    }, duration * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [replayCounter, currentVideoIndex, currentlyPlaying, playlist, playNext, playVideo]);


  return {
    playlist,
    currentlyPlaying,
    currentVideoIndex,
    replayCounter,
    addVideo,
    removeVideo,
    updateVideo,
    playVideo,
    playNext,
    playPrev,
    restart,
    clearAll,
  };
};

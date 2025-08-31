"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePlaylist } from "@/hooks/usePlaylist";
import { Player } from "@/components/Player";
import { Playlist } from "@/components/Playlist";
import { AddPlaylistForm } from "@/components/AddPlaylistForm";
import { extractVideoId, toOEmbedUrl } from "@/lib/tiktok";


// TikTok utilities moved to src/lib/tiktok.ts

export default function Home() {
  const {
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
  } = usePlaylist();

  const [embedHtml, setEmbedHtml] = useState("");
  const [isVideoPlayerVisible, setIsVideoPlayerVisible] = useState(true);
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);
  const [queuedIndex, setQueuedIndex] = useState<number | null>(null);
  const oembedCache = useRef<Map<string, string>>(new Map());
  const currentEmbedIdRef = useRef<string | null>(null);

  const handleAddVideo = (url: string) => {
    const videoId = extractVideoId(url);
    if (videoId) {
      // queue autoplay of the newly added video
      const nextIndex = playlist.length;
      setQueuedIndex(nextIndex);
      addVideo({ id: videoId, url });
    }
  };

  // Autoplay newly added video after playlist updates
  // (moved below handlePlayVideo definition to avoid TDZ)

  const handlePlayVideo = useCallback(async (index: number, options = { autoplay: true }) => {
    if (index >= 0 && index < playlist.length) {
      try {
        setIsVideoPlayerVisible(true);
        playVideo(index);
        setEmbedHtml("");
        setIsLoadingEmbed(true);
        const video = playlist[index];
        currentEmbedIdRef.current = video.id;
        let html = oembedCache.current.get(video.url) ?? "";
        if (!html) {
          const response = await fetch(toOEmbedUrl(video.url));
          if (!response.ok) {
            throw new Error("Failed to fetch oEmbed data.");
          }
          const data = await response.json();
          html = (data as any).html as string;
          oembedCache.current.set(video.url, html);
        }
        if (!options.autoplay) {
          html = html.replace(/autoplay=1/g, "autoplay=0").replace(/data-autoplay="true"/g, 'data-autoplay="false"');
        }
        setEmbedHtml(html);
        setIsLoadingEmbed(false);
      } catch (error) {
        console.error("Failed to fetch oEmbed data:", error);
        setIsLoadingEmbed(false);
      }
    }
  }, [playlist, playVideo]);

  const handlePlayAll = () => {
    if (playlist.length > 0) {
      handlePlayVideo(0);
    }
  };

  const handleRestart = () => {
    restart();
    setEmbedHtml("");
    setIsVideoPlayerVisible(false);
    setQueuedIndex(null);
  }

  const handleClearAll = () => {
    clearAll();
    setEmbedHtml("");
    setIsVideoPlayerVisible(false);
    setQueuedIndex(null);
  };

  // Autoplay newly added video after playlist updates
  useEffect(() => {
    if (queuedIndex !== null && queuedIndex >= 0 && queuedIndex < playlist.length) {
      handlePlayVideo(queuedIndex, { autoplay: true });
      setQueuedIndex(null);
    }
  }, [playlist.length, queuedIndex, handlePlayVideo]);

  // When the hook auto-advances currentVideoIndex, ensure embed updates
  useEffect(() => {
    if (currentVideoIndex >= 0 && currentVideoIndex < playlist.length) {
      const video = playlist[currentVideoIndex];
      if (currentEmbedIdRef.current !== video.id) {
        let cancelled = false;
        (async () => {
          try {
            setIsVideoPlayerVisible(true);
            setIsLoadingEmbed(true);
            setEmbedHtml("");
            let html = oembedCache.current.get(video.url) ?? "";
            if (!html) {
              const response = await fetch(toOEmbedUrl(video.url));
              if (!response.ok) throw new Error("Failed to fetch oEmbed data.");
              const data = await response.json();
              html = (data as any).html as string;
              oembedCache.current.set(video.url, html);
            }
            if (!cancelled) {
              currentEmbedIdRef.current = video.id;
              setEmbedHtml(html);
            }
          } catch (e) {
            console.error(e);
          } finally {
            if (!cancelled) setIsLoadingEmbed(false);
          }
        })();
        return () => {
          cancelled = true;
        };
      }
    }
  }, [currentVideoIndex, playlist]);

  // If nothing is playing, clear embed
  useEffect(() => {
    if (!currentlyPlaying) {
      currentEmbedIdRef.current = null;
      setEmbedHtml("");
    }
  }, [currentlyPlaying]);

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(380px,560px)] gap-8 items-start">
        <div>
          <Player
            currentlyPlaying={currentlyPlaying}
            embedHtml={embedHtml}
            isVisible={isVideoPlayerVisible}
            onHide={() => setIsVideoPlayerVisible(false)}
            onPlayNext={playNext}
            onPlayPrev={playPrev}
            replayCounter={replayCounter}
            isLoading={isLoadingEmbed}
          />
        </div>
        <div className="space-y-8">
          <AddPlaylistForm onAddVideo={handleAddVideo} />
          <Playlist
            playlist={playlist}
            currentlyPlaying={currentlyPlaying}
            currentVideoIndex={currentVideoIndex}
            onPlayVideo={handlePlayVideo}
            onRemoveVideo={removeVideo}
            onUpdateVideo={updateVideo}
            onRestart={handleRestart}
            onClearAll={handleClearAll}
            onPlayAll={handlePlayAll}
            isPlayerVisible={isVideoPlayerVisible}
            onTogglePlayerVisibility={() => setIsVideoPlayerVisible(prev => !prev)}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

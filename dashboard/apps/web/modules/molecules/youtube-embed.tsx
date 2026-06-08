import { Box, SelectChangeEvent, SxProps, Theme } from '@mui/material';
import VideoControl from 'modules/molecules/video-control';
import React, { useEffect, useMemo, useRef, useState } from 'react';

type YouTubeEmbedProps = {
  videoUrl: string;
  sx?: SxProps<Theme>;
};

const extractVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.searchParams.has('v')) {
        return parsed.searchParams.get('v');
      }
      const paths = parsed.pathname.split('/');
      const embedIndex = paths.findIndex((p) => p === 'embed');
      if (embedIndex !== -1 && paths[embedIndex + 1]) {
        return paths[embedIndex + 1] || null;
      }
    }
    return null;
  } catch {
    return null;
  }
};

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoUrl, sx }) => {
  const videoId = useMemo(() => extractVideoId(videoUrl), [videoUrl]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [volume, setVolume] = useState(100);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const sendCommand = (command: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args }),
      '*',
    );
  };

  // sync progress
  useEffect(() => {
    const interval = setInterval(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 'yt-player' }),
        '*',
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      try {
        const data = JSON.parse(event.data);
        if (data.info) {
          if (typeof data.info.currentTime === 'number') {
            setProgress(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number') {
            setDuration(data.info.duration);
          }
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      sendCommand('pauseVideo');
    } else {
      sendCommand('playVideo');
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const vol = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(vol || 0);
    sendCommand('setVolume', [vol]);
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    const time = Array.isArray(newValue) ? newValue[0] : newValue;
    setProgress(time || 0);
    sendCommand('seekTo', [time, true]);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (event: SelectChangeEvent<number>) => {
    const newRate = event.target.value;
    setPlaybackRate(newRate);
    sendCommand('setPlaybackRate', [newRate]);
  };

  const handleVolumeToggle = () => {
    setVolume(volume > 0 ? 0 : 100);
    if (volume > 0) {
      sendCommand('setVolume', [0]);
    } else {
      sendCommand('setVolume', [100]);
    }
  };

  if (!videoId) {
    return <Box color="error.main">Invalid YouTube URL</Box>;
  }

  const embedOptions = {
    enablejsapi: '1',
    controls: '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
  };

  return (
    <Box
      ref={containerRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box sx={{ aspectRatio: '16/9', position: 'relative' }}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?${new URLSearchParams(embedOptions).toString()}`}
          title="YouTube video player"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </Box>
      {/* Custom Controls */}
      <VideoControl
        isHover={isHover}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        handleSeek={handleSeek}
        handlePlayPause={handlePlayPause}
        handleVolumeToggle={handleVolumeToggle}
        handleVolumeChange={handleVolumeChange}
        handleSpeedChange={handleSpeedChange}
        toggleFullscreen={toggleFullscreen}
        volume={volume}
        playbackRate={playbackRate}
        isFullscreen={isFullscreen}
      />
    </Box>
  );
};

export default YouTubeEmbed;

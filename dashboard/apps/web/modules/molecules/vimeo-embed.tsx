import {
  Box,
  CircularProgress,
  SelectChangeEvent,
  SxProps,
  Theme,
} from '@mui/material';
import Player from '@vimeo/player';
import React, { useEffect, useRef, useState } from 'react';

import VideoControl from './video-control';

interface VimeoPlayerProps {
  videoUrl: string;
  sx?: SxProps<Theme>;
}

const getVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] || null : null;
};

const VimeoPlayer: React.FC<VimeoPlayerProps> = ({ videoUrl, sx }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [disabledPlaybackRate, setDisabledPlaybackRate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (iframeRef.current) {
      const player = new Player(iframeRef.current);
      playerRef.current = player;

      player.getDuration().then(setDuration);

      player.on('play', () => setPlaying(true));
      player.on('pause', () => setPlaying(false));

      player.on('timeupdate', (data: { seconds: number }) => {
        setProgress(data.seconds);
      });

      player.on('volumechange', (data: { volume: number }) => {
        setVolume(data.volume);
      });

      player.on('playbackratechange', (data: { playbackRate: number }) => {
        setPlaybackRate(data.playbackRate);
      });

      player.on('error', (err: { message: string }) => {
        setError(err.message);
      });

      player.on('loaded', () => {
        setLoading(false);
      });

      player.on('bufferstart', () => {
        setLoading(true);
      });

      player.on('bufferend', () => {
        setLoading(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playing) playerRef.current.pause();
    else playerRef.current.play();
  };

  const handleSeek = (_: Event, newValue: number | number[]) => {
    if (playerRef.current && typeof newValue === 'number') {
      playerRef.current.setCurrentTime(newValue);
      setProgress(newValue);
    }
  };

  const handleVolume = (newValue: number) => {
    if (playerRef.current && typeof newValue === 'number') {
      playerRef.current.setVolume(newValue);
      setVolume(newValue);
    }
  };

  const handleSpeed = (event: SelectChangeEvent<number>) => {
    const rate = event.target.value;
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(rate).catch(() => {
        setDisabledPlaybackRate(true);
      });
    }
  };

  const videoId = getVimeoId(videoUrl);

  if (!videoId || error) {
    return <Box color="error.main">{error || 'Invalid Vimeo URL'} </Box>;
  }

  return (
    <Box
      ref={containerRef}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      sx={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        maxWidth: '900px',
        ...sx,
      }}
    >
      <Box
        sx={{ aspectRatio: '16/9', position: 'relative' }}
        onClick={() => togglePlay()}
      >
        <iframe
          ref={iframeRef}
          src={`https://player.vimeo.com/video/${videoId}?controls=0`}
          width="100%"
          height="100%"
          title="Vimeo video player"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
      {/* Custom Controls */}
      <VideoControl
        isHover={isHover}
        isPlaying={playing}
        progress={progress}
        duration={duration}
        handleSeek={handleSeek}
        handlePlayPause={togglePlay}
        handleVolumeToggle={() => {
          handleVolume(volume > 0 ? 0 : 1);
        }}
        handleVolumeChange={(_: Event, newValue: number | number[]) => {
          handleVolume((newValue as number) / 100);
        }}
        handleSpeedChange={handleSpeed}
        toggleFullscreen={() => {
          if (containerRef.current) {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              containerRef.current.requestFullscreen();
            }
          }
        }}
        volume={volume * 100}
        playbackRate={playbackRate}
        isFullscreen={false}
        disabledPlaybackRate={disabledPlaybackRate}
      />
    </Box>
  );
};

export default VimeoPlayer;

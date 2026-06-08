import {
  Box,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Typography,
} from '@mui/material';
import Iconify from 'modules/components/iconify';
import { ICONS_NAME } from 'modules/const/icons';
import React from 'react';

interface VideoControlProps {
  isHover: boolean;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isFullscreen: boolean;
  handleSeek: (event: Event, newValue: number | number[]) => void;
  handlePlayPause: () => void;
  handleVolumeToggle: () => void;
  handleVolumeChange: (event: Event, newValue: number | number[]) => void;
  handleSpeedChange: (event: SelectChangeEvent<number>) => void;
  toggleFullscreen: () => void;
  disabledPlaybackRate?: boolean;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function VideoControl({
  isHover,
  isPlaying,
  progress,
  duration,
  volume,
  playbackRate,
  isFullscreen,
  handleSeek,
  handlePlayPause,
  handleVolumeToggle,
  handleVolumeChange,
  handleSpeedChange,
  toggleFullscreen,
  disabledPlaybackRate,
}: VideoControlProps) {
  return (
    <Box
      sx={{
        pb: 1,
        transition: 'bottom 0.5s ease-in-out',
        position: 'absolute',
        bottom: isHover || isPlaying ? 0 : -40,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        bgcolor: 'rgba(0,0,0,0.6)',
        zIndex: 1000,
      }}
    >
      {/* Timeline */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 0.5,
        }}
      >
        <Slider
          value={progress}
          onChange={handleSeek}
          min={0}
          max={duration}
          sx={{ px: 0, py: 1, color: 'white' }}
        />
        <Typography
          variant="caption"
          color="white"
          sx={{ whiteSpace: 'nowrap' }}
        >
          {formatTime(progress)} / {formatTime(duration)}
        </Typography>
      </Box>

      {/* Controls row */}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={handlePlayPause}>
            {isPlaying ? (
              <Iconify icon={ICONS_NAME.pause} style={{ color: 'white' }} />
            ) : (
              <Iconify icon={ICONS_NAME.play} style={{ color: 'white' }} />
            )}
          </IconButton>

          <IconButton size="small" onClick={handleVolumeToggle}>
            <Iconify
              icon={volume > 0 ? ICONS_NAME.volume : ICONS_NAME.volumeOff}
              style={{ color: 'white' }}
            />
          </IconButton>
          <Slider
            value={volume}
            onChange={handleVolumeChange}
            min={0}
            max={100}
            sx={{ width: 120, color: 'white', height: 4 }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Playback speed */}
          <Select
            value={playbackRate}
            onChange={handleSpeedChange}
            size="small"
            disabled={disabledPlaybackRate}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              '& .MuiSvgIcon-root': { color: 'white' },
            }}
            slotProps={{
              input: {
                sx: {
                  py: 0.5,
                  px: 1,
                },
              },
            }}
          >
            {[0.25, 0.5, 1, 1.25, 1.5, 2].map((rate) => (
              <MenuItem key={rate} value={rate}>
                {rate}x
              </MenuItem>
            ))}
          </Select>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton size="small" onClick={toggleFullscreen}>
            <Iconify
              icon={
                isFullscreen ? ICONS_NAME.fullscreenExit : ICONS_NAME.fullscreen
              }
              style={{ color: 'white' }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

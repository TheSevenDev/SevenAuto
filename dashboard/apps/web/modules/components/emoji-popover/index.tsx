import { IconButton, SxProps, Theme } from '@mui/material';
import EmojiPicker, {
  EmojiClickData,
  Theme as EmojiTheme,
} from 'emoji-picker-react';
import { ICONS_NAME } from 'modules/const/icons';
import React from 'react';

import CustomPopover, { usePopover } from '../custom-popover';
import Iconify from '../iconify';
import { useSettingsContext } from '../settings';

type Props = {
  onSelect: (emoji: string) => void;
  sx?: SxProps<Theme>;
  position?: 'bottom-center' | 'top-center';
  isReactions?: boolean;
};

const EmojiPopover: React.FC<Props> = ({
  onSelect,
  sx,
  position = 'bottom-center',
  isReactions = false,
}) => {
  const popover = usePopover();
  const { themeMode } = useSettingsContext();

  return (
    <>
      <IconButton onClick={popover.onOpen} sx={sx}>
        <Iconify icon={ICONS_NAME.emoji} />
      </IconButton>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow={position}
        sx={{
          p: 0,
          background: 'transparent',
          // boxShadow: 'none',
          ...(isReactions && {
            borderRadius: '50px',
          }),
        }}
      >
        <EmojiPicker
          reactionsDefaultOpen={isReactions}
          onReactionClick={(emojiObject: EmojiClickData) => {
            onSelect(emojiObject.emoji);
          }}
          theme={themeMode === 'dark' ? EmojiTheme.DARK : EmojiTheme.LIGHT}
          onEmojiClick={(emojiObject: EmojiClickData) => {
            onSelect(emojiObject.emoji);
          }}
        />
      </CustomPopover>
    </>
  );
};

export default EmojiPopover;

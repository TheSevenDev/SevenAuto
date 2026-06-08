import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { EMediaType, IMedia } from '@seven-auto/libs';
import { Level } from '@tiptap/extension-heading';
import { BubbleMenu } from '@tiptap/react/menus';
import { useTranslate } from 'modules/locales';
import { useMediaStore } from 'modules/store/media';
import { getMediaUrlWithoutAssets } from 'modules/utils/get-media-url';
import { useCallback, useState } from 'react';

import Iconify from '../iconify';
import { StyledEditorToolbar } from './styles';
import { EditorToolbarProps, EEditorIcons } from './types';

// ----------------------------------------------------------------------

export default function Toolbar({
  id,
  // simple,
  type = 'inline',
  editor,
  disabled,
  sx,
}: EditorToolbarProps) {
  const { setMediaState } = useMediaStore();

  const [url, setUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectMedia = (selected?: IMedia) => {
    setMediaState({
      openMediaDialog: true,
      isSelectMultiple: false,
      selected: selected ? [selected] : [],
      filters: { types: [EMediaType.IMAGE] },
      onCallBack: (media: IMedia | IMedia[]) => {
        const selectedMedia = Array.isArray(media) ? media[0] : media;
        if (!selectedMedia) return;
        if (selectedMedia.type === EMediaType.VIDEO) {
          // editor
          //   .chain()
          //   .focus()
          //   .setNode('video', {
          //     src: getMediaUrlWithoutAssets(media, 'url'),
          //     title: media.title || '',
          //     alt: media.alt || media.title || '',
          //   })
          //   .run();
        } else if (selectedMedia.type === EMediaType.IMAGE) {
          editor
            .chain()
            .focus()
            .setImage({
              src: getMediaUrlWithoutAssets(selectedMedia, 'url'),
              alt: selectedMedia.alt || selectedMedia.title || '',
              title: selectedMedia.title || '',
            })
            .run();
        } else {
          // add link to file
          // editor
          //   .chain()
          //   .focus()
          //   .setNode('file', {
          //     src: getMediaUrlWithoutAssets(media, 'url'),
          //     title: media.title || '',
          //     alt: media.alt || media.title || '',
          //   })
          //   .run();
        }
        setMediaState({
          openMediaDialog: false,
          isSelectMultiple: true,
        });
      },
    });
  };

  const openModal = useCallback(() => {
    setUrl(editor.getAttributes('link').href);
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl('');
  }, []);

  const saveLink = useCallback(() => {
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: '_blank' })
        .run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    closeModal();
  }, [editor, url, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const toggleBulletList = useCallback(() => {
    editor.chain().focus().toggleBulletList().run();
  }, [editor]);

  const toggleOrderedList = useCallback(() => {
    editor.chain().focus().toggleOrderedList().run();
  }, [editor]);

  const onClearFormat = useCallback(() => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  }, [editor]);

  const onSelectHeading = useCallback(
    (level: number) => {
      if (parseInt(level.toString(), 10) === 0) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor
          .chain()
          .focus()
          .setHeading({ level: +level as Level })
          .run();
      }
    },
    [editor],
  );

  const toggleAlign = useCallback(
    (value: string) => {
      editor.chain().focus().setTextAlign(value).run();
    },
    [editor],
  );

  const currentAlignment = useCallback(() => {
    if (editor.isActive({ textAlign: 'left' })) return 'left';
    if (editor.isActive({ textAlign: 'center' })) return 'center';
    if (editor.isActive({ textAlign: 'right' })) return 'right';
    if (editor.isActive({ textAlign: 'justify' })) return 'justify';
    return 'left';
  }, [editor]);

  const toggleSuperscript = useCallback(() => {
    editor.chain().focus().toggleSuperscript().run();
  }, [editor]);

  const toggleSubscript = useCallback(() => {
    editor.chain().focus().toggleSubscript().run();
  }, [editor]);

  const toggleBlockquote = useCallback(() => {
    editor.chain().focus().toggleBlockquote().run();
  }, [editor]);

  const renderToolbar = (
    <Box className="editor-toolbar">
      <Select
        value={editor?.getAttributes('heading').level || '0'}
        size="small"
        disabled={disabled}
        sx={{
          minWidth: 100,
          height: 30,
          borderRadius: 0,
          border: 'none',
          outline: 'none',
          '&:focus': { border: 'none' },
          '& fieldset': { display: 'none' },
          ...(editor.isActive('heading') && {
            color: 'primary.main',
            '& .MuiSelect-select': {
              color: 'primary.main',
            },
          }),
          '& .MuiSelect-select': {
            '&:hover': { color: 'primary.main' },
          },
        }}
        onChange={(e) => {
          onSelectHeading(e.target.value || '0');
        }}
      >
        <MenuItem
          sx={{
            ...(editor.isActive('heading', { level: 1 }) && {
              color: 'primary.main',
            }),
          }}
          value={0}
        >
          Normal text
        </MenuItem>
        {/* <MenuItem value={1}>Heading 1</MenuItem> */}
        <MenuItem value={2}>Heading 2</MenuItem>
        <MenuItem value={3}>Heading 3</MenuItem>
        <MenuItem value={4}>Heading 4</MenuItem>
        <MenuItem value={5}>Heading 5</MenuItem>
        <MenuItem value={6}>Heading 6</MenuItem>
      </Select>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Undo" arrow>
        <span>
          <IconButton
            size="small"
            className="menu-button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo() || disabled}
          >
            <Iconify icon={EEditorIcons.UNDO} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Redo" arrow>
        <span>
          <IconButton
            size="small"
            className="menu-button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo() || disabled}
          >
            <Iconify icon={EEditorIcons.REDO} />
          </IconButton>
        </span>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Bold" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('bold') ? 'is-active' : ''}`}
            onClick={toggleBold}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.BOLD} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Underline" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('underline') ? 'is-active' : ''}`}
            onClick={toggleUnderline}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.UNDERLINE} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Italic" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('italic') ? 'is-active' : ''}`}
            onClick={toggleItalic}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.ITALIC} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Strike" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('strike') ? 'is-active' : ''}`}
            onClick={toggleStrike}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.STRIKE} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Superscript" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('superscript') ? 'is-active' : ''}`}
            onClick={toggleSuperscript}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.SUPERSCRIPT} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Subscript" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('subscript') ? 'is-active' : ''}`}
            onClick={toggleSubscript}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.SUB} />
          </IconButton>
        </span>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Bullet List" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
            disabled={disabled}
            onClick={toggleBulletList}
          >
            <Iconify icon={EEditorIcons.LIST_BULLETED} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Ordered List" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
            onClick={toggleOrderedList}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.LIST_NUMBERED} />
          </IconButton>
        </span>
      </Tooltip>
      <Divider orientation="vertical" flexItem />
      <Tooltip title="Link" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('link') ? 'is-active' : ''}`}
            onClick={openModal}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.LINK} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Blockquote" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
            onClick={toggleBlockquote}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.BLOCKQUOTE} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Code" arrow>
        <span>
          <IconButton
            size="small"
            className={`menu-button ${editor.isActive('code') ? 'is-active' : ''}`}
            onClick={toggleCode}
            disabled={disabled}
          >
            <Iconify icon={EEditorIcons.CODE} />
          </IconButton>
        </span>
      </Tooltip>
      <Select
        value={currentAlignment()}
        disabled={disabled}
        sx={{
          height: 30,
          padding: 0,
          paddingTop: 0.5,
          margin: 0,
          borderRadius: 0,
          border: 'none',
          outline: 'none',
          '&:focus': { border: 'none' },
          '& fieldset': { display: 'none' },
          '& .MuiSelect-select': {
            padding: '0px 8px !important',
            margin: 0,
            borderRadius: 0,
            border: 'none',
            outline: 'none',
            '&:focus': { border: 'none' },
            '&:hover': { color: 'primary.main' },
          },
        }}
        IconComponent={() => null}
        onChange={(e) => {
          toggleAlign(e.target.value);
        }}
      >
        <MenuItem
          value="left"
          disabled={editor.isActive({ textAlign: 'left' })}
        >
          <Iconify sx={{ mx: 'auto' }} icon={EEditorIcons.ALIGN_LEFT} />
        </MenuItem>
        <MenuItem
          value="center"
          disabled={editor.isActive({ textAlign: 'center' })}
        >
          <Iconify sx={{ mx: 'auto' }} icon={EEditorIcons.ALIGN_CENTER} />
        </MenuItem>
        <MenuItem
          value="right"
          disabled={editor.isActive({ textAlign: 'right' })}
        >
          <Iconify sx={{ mx: 'auto' }} icon={EEditorIcons.ALIGN_RIGHT} />
        </MenuItem>
        <MenuItem
          value="justify"
          disabled={editor.isActive({ textAlign: 'justify' })}
        >
          <Iconify sx={{ mx: 'auto' }} icon={EEditorIcons.ALIGN_JUSTIFY} />
        </MenuItem>
      </Select>
      <Tooltip title="Media" arrow>
        <span>
          <IconButton
            size="small"
            className="menu-button"
            onClick={() => handleSelectMedia()}
          >
            <Iconify icon={EEditorIcons.IMAGE} />
          </IconButton>
        </span>
      </Tooltip>

      <Divider orientation="vertical" flexItem />
      <Tooltip title="Clear Format" arrow>
        <span>
          <IconButton
            size="small"
            disabled={disabled}
            className="menu-button"
            onClick={onClearFormat}
          >
            <Iconify icon={EEditorIcons.FORMAT_CLEAR} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );

  return (
    <StyledEditorToolbar id={id} sx={sx}>
      {type === 'popup' ? (
        <BubbleMenu
          pluginKey="bubbleMenuText"
          className="bubble-menu"
          editor={editor}
          shouldShow={({
            // editor: currentEditor,
            // view,
            // state,
            // oldState,
            from,
            to,
          }) =>
            // only show if range is selected.
            from !== to
          }
        >
          {renderToolbar}
        </BubbleMenu>
      ) : (
        renderToolbar
      )}

      <BubbleMenu
        pluginKey="bubbleMenuLink"
        className="bubble-menu"
        editor={editor}
        shouldShow={({
          // editor: currentEditor,
          // view,
          // state,
          // oldState,
          from,
          to,
        }) =>
          // only show the bubble menu for links.
          from === to && editor.isActive('link')
        }
      >
        <Box className="editor-toolbar">
          <IconButton size="small" className="menu-button" onClick={openModal}>
            <Iconify icon="material-symbols:edit" />
          </IconButton>
          <IconButton size="small" className="menu-button" onClick={removeLink}>
            <Iconify icon="material-symbols:delete" />
          </IconButton>
        </Box>
      </BubbleMenu>
      <LinkDialog
        url={url}
        isOpen={isOpen}
        onRequestClose={closeModal}
        closeModal={closeModal}
        onChangeUrl={(e) => setUrl(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />
    </StyledEditorToolbar>
  );
}

function LinkDialog({
  url,
  isOpen,
  onRequestClose,
  contentLabel,
  closeModal,
  onChangeUrl,
  onSaveLink,
  onRemoveLink,
}: {
  url: string;
  isOpen: boolean;
  onRequestClose: () => void;
  closeModal: () => void;
  onChangeUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveLink: () => void;
  onRemoveLink: () => void;
  contentLabel?: string;
}) {
  const { t } = useTranslate();
  return (
    <Dialog open={isOpen} maxWidth="xs" fullWidth onClose={onRequestClose}>
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1,
        }}
      >
        <IconButton size="small" onClick={closeModal}>
          <Iconify icon="material-symbols:close" />
        </IconButton>
      </Box>
      <DialogTitle>{contentLabel || t('basic.editLink')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          value={url}
          fullWidth
          variant="outlined"
          onChange={onChangeUrl}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onRemoveLink}>
          {t('basic.remove')}
        </Button>
        <Button onClick={onSaveLink} variant="contained" color="primary">
          {t('basic.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

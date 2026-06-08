import { SxProps, Theme } from '@mui/material/styles';
import { Editor } from '@tiptap/react';

// ----------------------------------------------------------------------

export interface EditorProps {
  id?: string;
  error?: boolean;
  type?: 'popup' | 'inline';
  simple?: boolean;
  helperText?: React.ReactNode;
  useStyles?: boolean;
  hasCounter?: boolean;
  sx?: SxProps<Theme>;
  sxToolbar?: SxProps<Theme>;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export type EditorToolbarProps = {
  id: string;
  editor: Editor;
  type?: 'popup' | 'inline';
  simple?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

export enum EEditorIcons {
  UNDO = 'material-symbols:rotate-left',
  REDO = 'material-symbols:rotate-right',
  LINK = 'material-symbols:link',
  BOLD = 'material-symbols:format-bold',
  UNDERLINE = 'material-symbols:format-underlined',
  ITALIC = 'material-symbols:format-italic',
  STRIKE = 'material-symbols:strikethrough-s',
  CODE = 'material-symbols:code',
  BLOCKQUOTE = 'material-symbols:format-quote',
  LIST_BULLETED = 'material-symbols:format-list-bulleted',
  LIST_NUMBERED = 'material-symbols:format-list-numbered',
  FORMAT_CLEAR = 'material-symbols:format-clear',
  ALIGN_CENTER = 'material-symbols:format-align-center',
  ALIGN_LEFT = 'material-symbols:format-align-left',
  ALIGN_RIGHT = 'material-symbols:format-align-right',
  ALIGN_JUSTIFY = 'material-symbols:format-align-justify',
  IMAGE = 'fluent-mdl2:media-add',
  SUPERSCRIPT = 'material-symbols:superscript',
  SUB = 'material-symbols:subscript',
}

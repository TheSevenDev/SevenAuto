'use client';

import 'modules/utils/highlight';

import { alpha, Box } from '@mui/material';
import {
  Editor as TiptapEditor,
  EditorContent,
  useEditor,
} from '@tiptap/react';

import Extensions from './extensions';
import { StyledEditor } from './styles';
import Toolbar from './toolbar';
import { EditorProps } from './types';
import { replaceAllAssetUrls, replaceAllAssetUrlsBack } from './utils';

// ----------------------------------------------------------------------

// const Document = Node.create({
//   name: 'doc',
//   topNode: true,
//   content: 'rootblock+',
// });

// const addParagraphAttributes = () => ({
//   data: {
//     default: null,
//     parseHTML: (element: HTMLElement) => ({
//       id: element.getAttribute('id'),
//       class: element.getAttribute('class'),
//       'data-user-generated': element.getAttribute('data-user-generated'),
//     }),
//     renderHTML: (attributes: Record<string, any>) => {
//       if (!attributes.data) {
//         return {};
//       }
//       return {
//         ...attributes.data,
//         'data-user-generated': attributes.data['data-user-generated'] || false,
//         class: attributes.data.class
//           ? `${attributes.data.class} my-0.5 mx-0`
//           : 'my-0.5 mx-0',
//       };
//     },
//   },
// });

export default function Editor({
  id = 'tiptap-editor',
  error,
  type = 'inline',
  simple = false,
  helperText,
  sx,
  useStyles = true,
  placeholder,
  value,
  onChange,
  disabled,
  sxToolbar,
  hasCounter = true,
}: EditorProps) {
  const baseEditor = useEditor({
    extensions: Extensions({
      placeholder: placeholder || '',
    }),
    editable: !disabled,
    content: replaceAllAssetUrlsBack(value),
    onUpdate({ editor }) {
      const newContent = editor.getHTML();
      if (onChange) onChange(replaceAllAssetUrls(newContent));
    },
    editorProps: {
      attributes: {
        class: useStyles ? 'prose' : '',
      },
    },
    immediatelyRender: false,
  }) as TiptapEditor;

  if (!baseEditor) return null;

  return (
    <>
      <StyledEditor
        hasCounter={hasCounter}
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
            '& .tiptap-editor': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        <Box id={id} className="tiptap-editor" sx={sx}>
          <Toolbar
            id={`${id}-toolbar`}
            simple={simple}
            type={type}
            editor={baseEditor}
            sx={sxToolbar}
          />
          <EditorContent editor={baseEditor} />
        </Box>
      </StyledEditor>
      {helperText && helperText}
    </>
  );
}

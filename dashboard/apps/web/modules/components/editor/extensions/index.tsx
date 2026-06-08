// => Tiptap packages
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
// import UniqueID from '@tiptap-pro/extension-unique-id';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Extensions as ExtensionsType, mergeAttributes } from '@tiptap/react';
import { addAssetsUrl } from 'modules/utils/get-media-url';

interface IProps {
  placeholder?: string;
}

const Extensions = ({ placeholder }: IProps): ExtensionsType => [
  // UniqueID.configure({
  //   types: ['heading', 'paragraph'],
  // }),
  Document,
  History,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
    HTMLAttributes: {
      class: 'heading',
      placeholder: 'Title',
    },
  }),
  Paragraph.extend({
    // add id attribute to the paragraph node
    // addAttributes: addParagraphAttributes,
  }),
  Text,
  Link.configure({
    openOnClick: false,
  }),
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  BulletList.configure({
    HTMLAttributes: {
      class: 'list-disc',
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: 'list-item',
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: 'list-decimal',
    },
  }),
  // Placeholder.configure({
  //   emptyEditorClass:
  //     'before:text-gray-400 before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none',
  //   includeChildren: true,
  //   placeholder: ({ node }: { node: { type: { name: string } } }) => {
  //     if (node.type.name === 'detailsSummary') {
  //       return 'Summary';
  //     }
  //     if (node.type.name === 'heading') {
  //       return 'Title';
  //     }
  //     return placeholder || '';
  //   },
  // }),
  Placeholder.configure({
    placeholder: placeholder || '',
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph', 'image'],
  }),
  Subscript,
  Superscript,
  Blockquote,
  Image.extend({
    renderHTML({ HTMLAttributes }) {
      const { style } = HTMLAttributes;
      // replace src with data-src to prevent loading images
      const src = addAssetsUrl(HTMLAttributes.src);
      return [
        'figure',
        { style },
        [
          'img',
          mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
            src,
            loading: 'lazy',
            decoding: 'async',
            style: 'max-width: 100%; height: auto;',
          }),
        ],
      ];
    },
  }),
];

export default Extensions;

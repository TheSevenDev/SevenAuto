import { Accept } from 'react-dropzone';

/**
 * react-dropzone v15: keys are MIME types only; extensions go in the value arrays.
 * @see https://github.com/react-dropzone/react-dropzone/tree/master/examples/accept
 */
export const fileManagerUploadAccept: Accept = {
  'image/*': [],
  'video/mp4': [],
  'video/webm': [],
  'video/quicktime': [],
  'video/3gpp': [],
  'video/x-msvideo': [],
  'video/x-flv': [],
  'video/x-matroska': [],
  'video/ogg': [],
  'video/mpeg': [],
  'video/x-ms-wmv': [],
  'audio/*': [],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    '.pptx',
  ],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
};

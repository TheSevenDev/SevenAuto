import { EMediaSource } from '@prisma/client';
import { EMediaType, IUser } from '@seven-auto/libs';

export type IImageFindMediaOne = {
  id: string;
};

export type IImageStorage = {
  file?: Express.Multer.File;
  url?: string;
  type?: string;
};

export type IMediaInput = {
  id?: string;
  alt?: string;
  ext?: string;
  title?: string;
  height?: number;
  width?: number;
  size?: number;
  hash?: string;
  url?: string;
  createdBy?: IUser;
  type?: EMediaType;
  source?: EMediaSource;
  urlLarge?: string;
  urlMedium?: string;
  urlRaw?: string;
  urlSmall?: string;
  urlTiny?: string;
};

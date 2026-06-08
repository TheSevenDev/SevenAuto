import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import * as path from 'path';
import sharp from 'sharp';
import slugify from 'slugify';
import { EnvService } from 'src/modules/env/env.service';

import {
  calculateImageWaterMarkPosition,
  genTextSVG,
  IWaterMark,
  TextWaterMarkPositionsDetail,
  WaterMarkPositions,
  WatermarkType,
} from './watermark';

interface IMediaResult {
  id?: number;
  title: string;
  ext: string;
  url: string;
  hash: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: number;
  urlLarge?: string;
  urlMedium?: string;
  urlSmall?: string;
  urlTiny?: string;
  urlRaw?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  type?: number;
}

interface IResize {
  file: Express.Multer.File;
  width: number;
  height: number;
}

interface IUpload {
  file: Express.Multer.File;
  filename: string;
  prefix: string;
  watermark?: boolean;
  watermarkType?: WatermarkType;
  watermarkPosition?: WaterMarkPositions;
  watermarkValue?: string;
}

interface IUploadStorage {
  file: Express.Multer.File;
  key: string;
}

interface IDeleteStorage {
  key: string;
}

interface ICompressImage {
  file: Express.Multer.File;
  media: IMediaResult;
  prefix: string;
}

const QUALITY = 100;

export const imageMimetypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/vnd.microsoft.icon',
  'image/tiff',
  'image/x-icon',
  'image/x-xbitmap',
  'image/x-xpixmap',
  'image/x-portable-pixmap',
  'image/x-portable-bitmap',
  'image/x-portable-graymap',
  'image/x-portable-anymap',
];

export const videoMimetypes = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/x-flv',
  'video/webm',
  'video/3gpp',
  'video/3gpp2',
  'video/avi',
];

export const fileMimetypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/zip',
  'application/x-rar-compressed',
  'application/octet-stream',
  'application/json',
  'application/xml',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-outlook',
  'text/csv',
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',
  'text/markdown',
  'text/calendar',

  // video
  ...videoMimetypes,
];

@Injectable()
export class MediaLibService {
  private s3: S3Client;
  private sizes;
  private bucket: string;

  constructor(private readonly env: EnvService) {
    this.s3 = new S3Client({
      region: this.env.S3_REGION,
      apiVersion: this.env.S3_API_VERSION,
      credentials: {
        accessKeyId: this.env.S3_ACCESSKEYID,
        secretAccessKey: this.env.S3_SECRETACCESSKEY,
      },
      ...(this.env.S3_ENDPOINT && { endpoint: this.env.S3_ENDPOINT }),
    });
    this.bucket = this.env.S3_BUCKET;
    this.sizes = [
      { name: 'tiny', width: 64, height: 64 },
      { name: 'small', width: 320, height: 320 },
      { name: 'medium', width: 640, height: 640 },
      { name: 'large', width: 1024, height: 1024 },
    ];
  }

  async uploadImage({
    file,
    filename,
    prefix,
    watermark = false,
    watermarkPosition,
    watermarkType,
    watermarkValue,
  }: IUpload): Promise<IMediaResult> {
    try {
      prefix = `${this.env.S3_PREFIX}/${prefix}`;
      // remove prefix slash
      if (prefix.startsWith('/')) prefix = prefix.slice(1);
      // replace double slash with single slash
      prefix = prefix.replace(/\/\//g, '/');
      if (!file) throw new BadRequestException(`File is required`);
      if (!imageMimetypes.includes(file.mimetype))
        throw new BadRequestException(`File type is not supported`);
      if (!filename) filename = file.originalname;
      if (!filename) filename = `image.${file.mimetype.split('/')[1]}`;
      const { name } = path.parse(filename);
      const key = this.getFileName({
        name: name,
        mimetype: file.mimetype,
      });

      //watermark
      if (watermark) {
        file = await this.addWatermark({
          file,
          position: watermarkPosition,
          type: watermarkType,
          value: watermarkValue,
        });
      }

      const res = await this.uploadStorage({ file, key: `${prefix}/${key}` });
      if (!res) throw new BadRequestException(`Image upload failed`);

      const data = await sharp(file.buffer).metadata();

      const media: IMediaResult = {
        title: filename,
        url: `${prefix}/${key}`,
        urlRaw: '',
        urlSmall: '',
        urlTiny: '',
        urlMedium: '',
        urlLarge: '',
        hash: key,
        ext: this.mimeTypeToExt(file.mimetype),
        alt: filename,
        width: data.width,
        height: data.height,
        size: data.size,
      };
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/wepb'
      ) {
        media.urlRaw = `${prefix}/raw/${key}`;
        for (const size of this.sizes) {
          if (data.width > size.width || data.height > size.height) {
            media[
              `url${size.name.charAt(0).toUpperCase() + size.name.slice(1)}`
            ] = `${prefix}/${size.name}/${media.hash}`;
          } else {
            media[
              `url${size.name.charAt(0).toUpperCase() + size.name.slice(1)}`
            ] = '';
          }
        }
        await this.compressImage({ file, media, prefix });
      }
      return media;
    } catch (error: unknown) {
      throw new HttpException(
        `Image Upload Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadFile({ file, filename, prefix }: IUpload): Promise<IMediaResult> {
    try {
      prefix = `${this.env.S3_PREFIX}/${prefix}`;
      // remove prefix slash
      if (prefix.startsWith('/')) prefix = prefix.slice(1);
      // replace double slash with single slash
      prefix = prefix.replace(/\/\//g, '/');
      if (!file) throw new BadRequestException(`File is required`);
      if (!fileMimetypes.includes(file.mimetype))
        throw new BadRequestException(`File type is not supported`);
      if (!filename) filename = file.originalname;
      if (!filename) filename = `file.${file.mimetype.split('/')[1]}`;
      const { name } = path.parse(filename);
      const mimetype = file.mimetype;

      let key = this.getFileName({
        name: name,
        mimetype,
      });
      if (mimetype === 'application/octet-stream') {
        key = key.replace('.bin', `.${filename.split('.').pop()}`);
      }
      const res = await this.uploadStorage({ file, key: `${prefix}/${key}` });
      if (!res) throw new BadRequestException(`File upload failed`);

      const media: IMediaResult = {
        title: filename,
        url: `${prefix}/${key}`,
        hash: key,
        ext: this.mimeTypeToExt(file.mimetype),
        alt: filename,
        size: file.size,
      };
      return media;
    } catch (error: unknown) {
      throw new HttpException(
        `File Upload Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadStorage({ file, key }: IUploadStorage) {
    try {
      const params = {
        Bucket: this.bucket,
        Key: key,
        ContentType: file?.mimetype || 'image/jpeg',
        Body: file.buffer,
      };
      const res = await this.s3.send(new PutObjectCommand(params));
      if (!res) return false;
      return res;
    } catch (error) {
      console.log('file: media.lib.ts:295 ~ uploadStorage ~ error:', error);
      return false;
    }
  }

  async deleteStorage({ key }: IDeleteStorage) {
    try {
      const res = await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return res;
    } catch {
      return false;
    }
  }

  async resize({ file, width, height }: IResize): Promise<Express.Multer.File> {
    try {
      if (
        file.mimetype !== 'image/jpeg' &&
        file.mimetype !== 'image/png' &&
        file.mimetype !== 'image/wepb'
      )
        return file;

      const clone: Express.Multer.File = { ...file };

      clone.buffer = await sharp(file.buffer)
        .resize(width, height, {
          kernel: sharp.kernel.nearest,
          fit: sharp.fit.inside,
        })
        .withMetadata()
        .toBuffer();
      return clone;
    } catch (error) {
      throw new HttpException(
        `Image Resize Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getImageFromUrl(url: string): Promise<{
    mimetype: string;
    size: number;
    originalname: string;
    buffer: Buffer;
  }> {
    try {
      const urlWithoutQuery = url.split('?')[0];
      const { ext, name } = path.parse(urlWithoutQuery);

      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      const contentType = response.headers['content-type'];

      return {
        mimetype: contentType.toString(),
        size:
          response.headers['content-length'] || response.data.byteLength || 0,
        originalname: `${name}${ext || `.${contentType.toString().split('/')[1]}`}`,
        buffer: Buffer.from(response.data),
      };
    } catch (error) {
      throw new HttpException(
        `Image Get Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getFileName({ name, mimetype }: { name: string; mimetype: string }): string {
    // mimetype to ext
    const ext = this.mimeTypeToExt(mimetype);
    return `${slugify(name, { lower: true, strict: true })}-${new Date().getTime()}.${ext}`;
  }

  async compressImage({
    prefix,
    file,
    media,
  }: ICompressImage): Promise<IMediaResult> {
    if (
      file.mimetype !== 'image/jpeg' &&
      file.mimetype !== 'image/png' &&
      file.mimetype !== 'image/webp'
    )
      return media;

    //Replace raw with url
    const data = await sharp(file.buffer).metadata();
    //Upload file raw
    const resRaw = await this.uploadStorage({
      file,
      key: `${prefix}/raw/${media.hash}`,
    });

    if (resRaw) media.urlRaw = `${prefix}/raw/${media.hash}`;

    file.buffer = await sharp(file.buffer)
      .rotate()
      .jpeg({ quality: QUALITY })
      .png({ quality: QUALITY })
      .webp({ quality: QUALITY })
      .withMetadata()
      .toBuffer();

    const resized = await this.resize({
      file,
      width: data.width > 1500 ? 1500 : data.width,
      height: data.height > 1500 ? 1500 : data.height,
    });

    const res = await this.uploadStorage({
      file: resized,
      key: `${prefix}/${media.hash}`,
    });
    if (res) media.url = `${prefix}/${media.hash}`;

    //Rezie and upload with sizes
    for (const size of this.sizes) {
      if (data.width > size.width || data.height > size.height) {
        const resized = await this.resize({ file, ...size });
        const res = await this.uploadStorage({
          file: resized,
          key: `${prefix}/${size.name}/${media.hash}`,
        });
        if (res)
          media[
            `url${size.name.charAt(0).toUpperCase() + size.name.slice(1)}`
          ] = `${prefix}/${size.name}/${media.hash}`;
      } else {
        media[`url${size.name.charAt(0).toUpperCase() + size.name.slice(1)}`] =
          '';
      }
    }
    return media;
  }

  async addWatermark({
    file,
    position,
    type,
    value,
  }: IWaterMark): Promise<Express.Multer.File> {
    const targetSharp = sharp(file.buffer);
    const targetMetadata = await targetSharp.metadata();
    const { width, height } = targetMetadata;

    let watermark: sharp.Sharp;
    let compositeOption: sharp.OverlayOptions;
    if (type === 'text') {
      watermark = sharp(
        genTextSVG(
          width,
          height,
          value,
          TextWaterMarkPositionsDetail[position],
        ),
      );
      compositeOption.left = 0;
      compositeOption.top = 0;
    }
    if (type === 'image') {
      const watermarkFile = await this.getImageFromUrl(value);
      watermark = sharp(watermarkFile.buffer as Buffer);
      const imageWatermarkMetadata = await watermark.metadata();
      const { left, top } = calculateImageWaterMarkPosition(
        width,
        height,
        imageWatermarkMetadata.width,
        imageWatermarkMetadata.height,
        position,
      );
      compositeOption.top = top;
      compositeOption.left = left;
    }
    compositeOption.input = await watermark.toBuffer();
    const clone: Express.Multer.File = { ...file };
    clone.buffer = await targetSharp.composite([compositeOption]).toBuffer();
    return clone;
  }

  mimeTypeToExt(mimetype: string): string {
    const types = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'image/bmp': 'bmp',
      'image/vnd.microsoft.icon': 'ico',
      'image/tiff': 'tiff',
      'image/x-icon': 'ico',
      'image/x-xbitmap': 'xbm',
      'image/x-xpixmap': 'xpm',
      'image/x-portable-pixmap': 'ppm',
      'image/x-portable-bitmap': 'pbm',
      'image/x-portable-graymap': 'pgm',
      'image/x-portable-anymap': 'pnm',
      //
      'video/mp4': 'mp4',
      'video/quicktime': 'mov',
      'video/x-msvideo': 'avi',
      'video/x-ms-wmv': 'wmv',
      'video/x-flv': 'flv',
      'video/webm': 'webm',
      'video/3gpp': '3gp',
      'video/3gpp2': '3g2',
      'video/avi': 'avi',
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/zip': 'zip',
      'application/x-rar-compressed': 'rar',
      'application/octet-stream': 'bin',
      'application/json': 'json',
      'application/xml': 'xml',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'pptx',
      'application/vnd.ms-outlook': 'msg',
      'text/csv': 'csv',
      'text/plain': 'txt',
      'text/html': 'html',
      'text/css': 'css',
      'text/javascript': 'js',
      'text/markdown': 'md',
      'text/calendar': 'ics',
    };
    return types[mimetype] || 'bin';
  }
}

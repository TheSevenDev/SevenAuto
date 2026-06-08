import { ApiProperty } from '@nestjs/swagger';
import { IMediaDelete, IMediaUploadFromUrl } from '@seven-auto/libs';
import { IsOptional, IsString } from 'class-validator';

/** Multipart form fields for upload (file comes from @UploadedFile()). */
export class MediaUploadQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'medium.jpeg',
    required: false,
    description: "Name's image.",
  })
  key?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '77782a2c2373085190801f541a73bc96062909949c65ab99be1d4038b560edf6',
    required: true,
    description: 'Generate at client with secret key.',
  })
  signature: string;
}

export type MediaUploadData = MediaUploadQueryDto & {
  file: Express.Multer.File;
};

export class MediaDeleteDto implements IMediaDelete {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: 'ck35lf16e00bq0730alu7xsl7/banhang1-1588835516950.jpg',
    required: true,
    description: '[userId]/[image-name].[ext]',
  })
  key = '';

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '8869e5824bbe9e32ae17983d0fab10343c159eac25bcbb32f186ba63511bd64c',
    required: true,
    description: 'Generate at client with secret key.',
  })
  signature = '';
}
export class MediaUploadFromUrlDto implements IMediaUploadFromUrl {
  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: true,
    description: "Image's URL.",
  })
  url: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '',
    required: true,
  })
  alt?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'medium.jpeg',
    required: false,
    description: "Image's name.",
  })
  key?: string;

  @IsString()
  @ApiProperty({
    type: 'string',
    example: '77782a2c2373085190801f541a73bc96062909949c65ab99be1d4038b560edf6',
    required: true,
    description: 'Generate at client with secret key.',
  })
  signature?: string;
}

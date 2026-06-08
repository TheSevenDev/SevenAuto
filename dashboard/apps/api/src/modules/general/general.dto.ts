import { ApiProperty } from '@nestjs/swagger';
import { ISiteInfo } from '@seven-auto/libs';
import { IsOptional, IsString } from 'class-validator';

export class SiteInfoUpdateDto implements ISiteInfo {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'Seven Auto',
    required: false,
  })
  siteName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'Seven Auto',
    required: false,
  })
  siteTitle?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'Seven Auto',
    required: false,
  })
  siteDescription?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'Seven Auto',
    required: false,
  })
  siteKeywords?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'seven-auto',
    required: false,
  })
  siteAuthor?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'Seven Auto',
    required: false,
  })
  siteCopyright?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'en-us',
    required: false,
  })
  siteLanguage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '/images/favicon.png',
    required: false,
  })
  siteIcon?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '/images/default.png',
    required: false,
  })
  siteImage?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '/images/logo.png',
    required: false,
  })
  siteLogo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '/images/logo.png',
    required: false,
  })
  siteTextLogo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: 'example@gmail.com',
    required: false,
  })
  siteEmail?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '0123456789',
    required: false,
  })
  sitePhone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  siteFooter?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  siteHeader?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  siteSocial?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  pixelId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  facebookAppId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  gtmId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  gaId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    example: '',
    required: false,
  })
  customCss?: string;
}

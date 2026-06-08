import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ELanguage, Prisma } from '@prisma/client';
import {
  EEmailTemplateKey,
  IEmailSend,
  IEmailSendMulti,
  IEmailSendTest,
  IEmailTemplate,
  IEmailTemplateFindMany,
  IEmailTemplateFindOne,
  IEmailTemplateLang,
  IEmailTemplateLangUpdate,
  IEmailTemplateUpdate,
} from '@seven-auto/libs';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntityDto, FindManyDto } from 'src/dto/utils.dto';
import { transformArray } from 'src/transform/transform.array';
import { transformBoolean } from 'src/transform/transform.boolean';
import { OrderByQuery } from 'src/transform/transform-order-by';

export class EmailTemplateDto extends BaseEntityDto implements IEmailTemplate {
  @ApiProperty({ enum: EEmailTemplateKey })
  @IsEnum(EEmailTemplateKey)
  key: EEmailTemplateKey;

  @ApiProperty({ type: 'string', isArray: true })
  @IsArray()
  variables: string[];

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  name: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString()
  content: string;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  @IsArray()
  langs: EmailTemplateLangDto[];
}

export class EmailTemplateLangDto
  extends BaseEntityDto
  implements IEmailTemplateLang
{
  @ApiProperty({ type: 'string', required: true })
  @IsString()
  emailTemplateId: string;

  @IsString()
  @ApiProperty({ enum: ELanguage })
  lang: ELanguage;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  title: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  content: string;
}

export class EmailSendDto implements IEmailSend {
  @IsEmail()
  @ApiProperty({ type: 'string', required: true })
  email: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  title: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  textSend: string;

  @IsString()
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  replyTo?: string;

  @IsString()
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  fromName?: string;

  @IsString()
  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  logo?: string;
}

export class EmailSendMultiDto
  extends OmitType(EmailSendDto, ['email'])
  implements IEmailSendMulti
{
  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @IsArray()
  @IsEmail({}, { each: true })
  @Transform(({ value }) => transformArray(value))
  listEmail: string[];

  @IsBoolean()
  @ApiPropertyOptional({ type: 'boolean', default: false })
  @IsOptional()
  @Transform(({ value }) => transformBoolean(value))
  useBcc?: boolean = false;
}

export class EmailTemplateFindManyDto
  extends FindManyDto
  implements IEmailTemplateFindMany
{
  @OrderByQuery({ id: 'desc' })
  orderBy?: Prisma.EmailTemplateCountOrderByAggregateInput;
}

export class EmailTemplateFindOneDto implements IEmailTemplateFindOne {
  @IsString()
  @ApiPropertyOptional({ type: 'string' })
  id?: string;

  @IsString()
  @ApiPropertyOptional({ enum: EEmailTemplateKey })
  key?: EEmailTemplateKey;
}

export class EmailSendTestDto implements IEmailSendTest {
  @IsString()
  @IsEmail()
  @ApiProperty({ type: 'string', required: true })
  email: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  title: string;

  @IsString()
  @ApiProperty({ type: 'string', required: true })
  content: string;

  @IsObject()
  @ApiProperty({ type: 'object', additionalProperties: true })
  variables: Record<string, string>;
}

export class EmailTemplateUpdateDto implements Omit<
  IEmailTemplateUpdate,
  'id'
> {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  content?: string;

  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: 'array', items: { type: 'object' } })
  @Transform(({ value }) => transformArray(value, 'object'))
  langs?: EmailTemplateLangUpdateDto[];
}

export class EmailTemplateLangUpdateDto implements IEmailTemplateLangUpdate {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: 'string' })
  id?: string;

  @IsString()
  @ApiProperty({ enum: ELanguage })
  lang: ELanguage;

  @IsString()
  @ApiProperty({ type: 'string' })
  title: string;

  @IsString()
  @ApiProperty({ type: 'string' })
  content: string;
}

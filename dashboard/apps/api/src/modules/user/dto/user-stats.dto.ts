import { ApiProperty } from '@nestjs/swagger';
import { IUserStats } from '@seven-auto/libs';
import { IsInt } from 'class-validator';

export class UserStatsDto implements IUserStats {
  @ApiProperty({
    type: 'number',
    example: 0,
    required: true,
  })
  @IsInt()
  postCount: number;
}

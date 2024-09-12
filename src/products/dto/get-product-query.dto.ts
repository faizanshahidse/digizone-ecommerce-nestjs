import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetProductQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  category?: string;
  platformType?: string;
  baseType?: string;
  homePage?: boolean;

  @Transform(({ value, obj }) => {
    parseInt(value);
    obj.limit = parseInt(obj.limit);
  })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Transform(({ value, obj }) => {
    parseInt(value);
    obj.skip = parseInt(obj.skip);
  })
  @IsNumber()
  @IsOptional()
  skip?: number;
}

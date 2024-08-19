import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  baseType,
  categoryType,
  Feedbackers,
  platformType,
  SkuDetails,
} from 'src/shared/schema/products';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  imageDetails?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  @IsEnum(categoryType)
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(platformType)
  platform: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(baseType)
  baseType: string;

  @IsString()
  @IsNotEmpty()
  productionUrl: string;

  @IsString()
  @IsNotEmpty()
  downloadUrl: string;

  @IsArray()
  @IsNotEmpty()
  requirementSpecification: Record<string, any>;

  @IsArray()
  @IsNotEmpty()
  highlights: string[];

  @IsOptional()
  skuDetails?: SkuDetails[];

  @IsOptional()
  @IsArray()
  feedbackDetails?: Feedbackers[];

  @IsOptional()
  stripeProductId?: string;
}

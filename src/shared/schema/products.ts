import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum categoryType {
  OPERATING_SYSTEM = 'operating system',
  APPLICATION_SOFTWARE = 'application software',
}

export enum platformType {
  WINDOWS = 'windows',
  MAC = 'mac',
  ANDROID = 'android',
  IOS = 'ios',
  LINUX = 'linux',
}

export enum baseType {
  COMPUTER = 'computer',
  MOBILE = 'mobile',
}

@Schema({ timestamps: true })
export class Feedbackers extends Document {
  @Prop({ required: true })
  customerId: string;

  @Prop({ required: true })
  CustomerName: string;

  rating: number;

  @Prop()
  feedbackMsg: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedbackers);

@Schema({ timestamps: true })
export class SkuDetails extends Document {
  @Prop({})
  skuName: string;

  price: number;

  validity: number;

  lifetime: boolean;

  stripeProductId: string;

  skuCode: string;
}

export const SkuDetailsSchema = SchemaFactory.createForClass(SkuDetails);

@Schema({ timestamps: true })
export class Products {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  image: string;

  @Prop({
    required: true,
    enum: [categoryType.OPERATING_SYSTEM, categoryType.APPLICATION_SOFTWARE],
  })
  category: string;

  @Prop({
    required: true,
    enum: [
      platformType.WINDOWS,
      platformType.MAC,
      platformType.ANDROID,
      platformType.IOS,
      platformType.LINUX,
    ],
  })
  platformType: string;

  @Prop({ required: true, enum: [baseType.COMPUTER, baseType.MOBILE] })
  baseType: string;

  @Prop({ required: true })
  productUrl: string;

  @Prop({ required: true })
  downloadUrl: string;

  @Prop()
  avgRating: string;

  @Prop([{ type: FeedbackSchema }])
  feedbackDetails: Feedbackers[];

  @Prop([{ type: SkuDetailsSchema }])
  skuDetails: SkuDetails[];

  @Prop({ type: Object })
  imageDetails: Record<string, any>;

  requirementSpecification: Record<string, any>[];

  highlights: string;

  stripeProductId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Products);

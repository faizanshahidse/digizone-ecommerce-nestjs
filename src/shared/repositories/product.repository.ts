import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products } from '../schema/products';
import { CreateProductDto } from 'src/products/dto/create-product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
  ) {}

  async create(products: CreateProductDto) {
    return await this.productModel.create(products);
  }

  async findProductWithGroupBy() {
    const products = await this.productModel.aggregate([
      {
        $facet: {
          latestProducts: [{ $sort: { createdAt: -1 } }, { $limit: 4 }],
          topRatedProducts: [{ $sort: { aveRating: -1 } }, { $limit: 8 }],
        },
      },
    ]);
    return products;
  }

  async find(query: Record<string, any>, options: any) {
    options.sort = options.sort || { _id: 1 };
    options.limit = options.limit || 10;
    options.skip = options.skip || 0;

    if (query.search) {
      query.productName = new RegExp(query.search, 'i');
      delete query.search;
    }

    const products = await this.productModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: options.sort,
      },
      {
        $skip: options.skip,
      },
      {
        $limit: options.limit,
      },
    ]);
    const totalProductsCount = await this.productModel.countDocuments(query);
    return { totalProductsCount, products };
  }
}

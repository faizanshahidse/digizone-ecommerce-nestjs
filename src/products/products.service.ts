import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { StripeService } from 'src/stripe/stripe.service';
// import q2m from 'qs-to-mongo';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productDB: ProductRepository,
    private readonly stripeService: StripeService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      // create product in stripe
      if (!createProductDto.stripeProductId) {
        const createdProductInStripe = await this.stripeService.createProduct({
          name: createProductDto.productName,
          description: createProductDto.description,
        });

        createProductDto.stripeProductId = createdProductInStripe.id;
      }

      // create product in DB
      const createdProductInDB = await this.productDB.create(createProductDto);

      return {
        success: true,
        message: 'Product created successfylly',
        result: createdProductInDB,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllProducts(query) {
    try {
      let homePage = false;

      if (query.homePage) {
        homePage = true;
      }
      delete query.homePage;

      if (homePage) {
        const products = await this.productDB.findProductWithGroupBy();

        return {
          success: true,
          message:
            products.length > 0
              ? 'Products fetched successfully'
              : 'No product found',
          result: products,
        };
      }

      // const { criteria, options, links } = q2m(query);

      // query.sort =
      //   query.sort && Object.fromEntries(new URLSearchParams(query.sort));

      const { limit, skip, sort_by, sort_order } = query;
      const options = {
        limit,
        skip,
        sort: { [sort_by]: sort_order === 'asc' ? 1 : -1 },
      };
      // const options = {
      //   limit: limit && +limit,
      //   skip: skip && +skip,
      //   sort: sort && {
      //     createdAt: +sort.createdAt,
      //   },
      // };
      delete query.limit;
      delete query.skip;
      delete query.sort_by;
      delete query.sort_order;

      const { totalProductsCount, products } = await this.productDB.find(
        query,
        options,
      );

      return {
        success: true,
        message:
          products.length > 0
            ? 'Products fetched successfylly'
            : 'No product found',
        result: {
          metadata: {
            skip: options.skip || 0,
            limit: options.limit || 0,
            totalCount: totalProductsCount,
            pages: options.limit
              ? Math.ceil(totalProductsCount / options.limit)
              : 1,
            // link: links('/', totalProductsCount),
          },
          products,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}

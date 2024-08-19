import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from 'src/shared/repositories/product.repository';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(ProductRepository) private readonly productDB: ProductRepository,
    @Inject(StripeService) private readonly stripeService: StripeService,
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

  findAll() {
    return `This action returns all products`;
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

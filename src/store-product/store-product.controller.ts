import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StoreDto } from 'src/store/store.dto';
import { StoreEntity } from 'src/store/store.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { StoreProductService } from './store-product.service';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class StoreProductController {
  constructor(private readonly storeProduct: StoreProductService) {}

  @Post(':productId/stores/:storeId')
  async addStoreToProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.storeProduct.addStoreToProduct(storeId, productId);
  }

  @Get(':productId/stores/:storeId')
  async findStoreByProductIdAndStoreId(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    return await this.storeProduct.findStoreByProductIdStoreId(
      storeId,
      productId,
    );
  }

  @Get(':productId/stores')
  async findStoresByProduct(@Param('productId') productId: string) {
    return await this.storeProduct.findStoresByProductId(productId);
  }

  @Put(':productId/stores')
  async associateStoresToProduct(
    @Param('productId') productId: string,
    @Body() storeDto: StoreDto[],
  ) {
    const stores = plainToInstance(StoreEntity, storeDto);
    return await this.storeProduct.associateProductsToStore(productId, stores);
  }

  @Delete(':productId/stores/:storeId')
  @HttpCode(204)
  async deleteStoreOfAProduct(
    @Param('productId') productId: string,
    @Param('storeId') storeId: string,
  ) {
    await this.storeProduct.deleteStoreFromProduct(storeId, productId);
  }
}

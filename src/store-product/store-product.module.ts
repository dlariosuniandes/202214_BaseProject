import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { ProductEntity } from 'src/product/product.entity';
import { StoreEntity } from 'src/store/store.entity';
import { StoreModule } from 'src/store/store.module';
import { StoreProductService } from './store-product.service';
import { StoreProductController } from './store-product.controller';

@Module({
  providers: [StoreProductService],
  imports: [
    TypeOrmModule.forFeature([ProductEntity, StoreEntity]),
    ProductModule,
    StoreModule,
  ],
  controllers: [StoreProductController],
})
export class StoreProductModule {}

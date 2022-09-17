import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { StoreEntity } from 'src/store/store.entity';

@Module({
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([StoreEntity, ProductEntity])],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}

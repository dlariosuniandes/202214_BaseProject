import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { ProductEntity } from 'src/product/product.entity';

@Module({
  providers: [StoreService],
  imports: [TypeOrmModule.forFeature([StoreEntity, ProductEntity])],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductEntity } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { StoreProductModule } from './store-product/store-product.module';
import { StoreEntity } from './store/store.entity';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    StoreModule,
    ProductModule,
    StoreProductModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'culture',
      entities: [StoreEntity, ProductEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

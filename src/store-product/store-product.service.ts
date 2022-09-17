import {
  ConflictException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { ProductEntity } from 'src/product/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from 'src/store/store.entity';
import { StoreService } from 'src/store/store.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class StoreProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
    private storeService: StoreService,
    private productService: ProductService,
  ) {}

  private findStoreInProduct(storeId, product: ProductEntity): StoreEntity {
    const interestStore: StoreEntity = product.stores.find(
      (pr) => pr.id === storeId,
    );
    if (!interestStore) {
      throw new PreconditionFailedException(
        'store with the given id is not associated to that product',
      );
    }
    return interestStore;
  }

  async addStoreToProduct(
    storeId: string,
    productId: string,
  ): Promise<ProductEntity> {
    const store: StoreEntity = await this.storeService.findOne(storeId);
    const product: ProductEntity = await this.productService.findOne(productId);
    if (product.stores.find((st) => st.id === storeId)) {
      throw new ConflictException('Product already has this store');
    }
    product.stores.push(store);
    return await this.productRepository.save(product);
  }

  async findStoreByProductIdStoreId(
    storeId: string,
    productId: string,
  ): Promise<StoreEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    return this.findStoreInProduct(storeId, product);
  }

  async findStoresByProductId(productId: string): Promise<StoreEntity[]> {
    const product: ProductEntity = await this.productService.findOne(productId);
    return product.stores;
  }

  async associateProductsToStore(
    productId: string,
    stores: StoreEntity[],
  ): Promise<ProductEntity> {
    for (const store of stores) {
      await this.storeService.findOne(store.id);
    }
    const product: ProductEntity = await this.productService.findOne(productId);
    product.stores = stores;
    const productResult = await this.productRepository.save(product);
    return productResult;
  }

  async deleteStoreFromProduct(storeId, productId): Promise<ProductEntity> {
    const product: ProductEntity = await this.productService.findOne(productId);
    const undesiredStore: StoreEntity = this.findStoreInProduct(
      storeId,
      product,
    );
    product.stores = product.stores.filter((pr) => pr !== undesiredStore);
    return await this.productRepository.save(product);
  }
}

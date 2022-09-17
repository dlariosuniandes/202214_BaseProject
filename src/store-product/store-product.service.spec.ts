import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductService } from './store-product.service';
import { Repository } from 'typeorm';
import { ProductEntity, typeProduct } from 'src/product/product.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from 'src/shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoreEntity } from 'src/store/store.entity';
import { StoreService } from 'src/store/store.service';
import { ProductService } from 'src/product/product.service';

describe('StoreProductService', () => {
  let storeProductProvider: StoreProductService;
  let storeProvider: StoreService;
  let productProvider: ProductService;
  let productRepository: Repository<ProductEntity>;
  let storeRepository: Repository<StoreEntity>;
  let productList: ProductEntity[];
  let storeList: StoreEntity[];

  const generateProduct = () => {
    const productDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      price: faker.finance.amount(0, 100),
      type: typeProduct.PERECEDEROS,
      stores: [],
    };
    return productDict;
  };

  const generateStore = () => {
    const storeDict: object = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      city: 'HIE',
      address: faker.lorem.sentence(),
      products: [],
    };
    return storeDict;
  };

  const seedDatabase = async () => {
    await storeRepository.clear();
    await productRepository.clear();
    productList = [];
    storeList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await productRepository.save(
        Object.assign(new ProductEntity(), generateProduct()),
      );
      const store: StoreEntity = await storeRepository.save(
        Object.assign(new StoreEntity(), generateStore()),
      );
      productList.push(product);
      storeList.push(store);
    }
    productList[0].stores = [storeList[0], storeList[1]];
    productList[1].stores = [storeList[2], storeList[3], storeList[4]];
    productList.map(async (pr) => await productRepository.save(pr));
    for (let i = 0; i < productList.length; i++) {
      productList[i] = await productProvider.findOne(productList[i].id);
    }
    storeList.slice(0, 2).forEach((store) => {
      const index = storeList.findIndex((st) => st.id == store.id);
      storeList[index].products = [
        ...storeList[index].products,
        productList[0],
      ];
    });
    storeList.slice(2, 5).forEach((store) => {
      const index = storeList.findIndex((st) => st.id == store.id);
      storeList[index].products = [
        ...storeList[index].products,
        productList[1],
      ];
    });
    storeList.map(async (cu) => await storeRepository.save(cu));
    for (let i = 0; i < storeList.length; i++) {
      storeList[i] = await storeProvider.findOne(storeList[i].id);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreProductService, ProductService, StoreService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    storeProductProvider = module.get<StoreProductService>(StoreProductService);
    storeProvider = module.get<StoreService>(StoreService);
    productProvider = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    storeRepository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    await seedDatabase();
  });

  it('should be defined', async () => {
    expect(storeProductProvider).toBeDefined();
  });

  it('should add store to product', async () => {
    const productId = productList[1].id;
    const storeId = storeList[1].id;
    await storeProductProvider.addStoreToProduct(storeId, productId);
    const modifiedProduct: ProductEntity = await productProvider.findOne(
      productId,
    );
    const addedStore: StoreEntity = await storeProvider.findOne(storeId);
    expect(modifiedProduct.stores.find((st) => st.id === storeId).id).toEqual(
      storeId,
    );
    expect(addedStore.products.find((pr) => productId === pr.id).id).toEqual(
      productId,
    );
  });

  it('should not add same product to store twice', async () => {
    const productId = productList[1].id;
    const storeId = storeList[1].id;
    await storeProductProvider.addStoreToProduct(storeId, productId);
    try {
      await storeProductProvider.addStoreToProduct(storeId, productId);
    } catch {
      const modifiedProduct: ProductEntity = await productProvider.findOne(
        productId,
      );
      expect(modifiedProduct.stores.length).toEqual(4);
    }
  });

  it('should find store in product', async () => {
    const productId = productList[0].id;
    const storeId = storeList[0].id;
    const store: StoreEntity =
      await storeProductProvider.findStoreByProductIdStoreId(
        storeId,
        productId,
      );
    expect(store).toBeDefined();
  });

  it('should return all stores in product', async () => {
    const productId = productList[0].id;
    const stores: StoreEntity[] =
      await storeProductProvider.findStoresByProductId(productId);
    expect(stores.length).toEqual(2);
  });

  it('should associate stores to product', async () => {
    const productId = productList[0].id;
    const newStores: StoreEntity[] = await storeProvider.findAll();
    await storeProductProvider.associateProductsToStore(productId, newStores);
    const product = await productProvider.findOne(productId);
    expect(product.stores.length).toEqual(5);
  });

  it('should delete store from product', async () => {
    const storeId = storeList[0].id;
    const productId = productList[0].id;
    await storeProductProvider.deleteStoreFromProduct(storeId, productId);
    const product: ProductEntity = await productProvider.findOne(productId);
    expect(product.stores.length).toEqual(1);
  });
});

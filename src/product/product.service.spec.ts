import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { ProductEntity, typeProduct } from './product.entity';
import { ProductService } from './product.service';
import { faker } from '@faker-js/faker';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productList: ProductEntity[];

  const seedDatabase = async () => {
    repository.clear();
    productList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.lorem.sentence(),
        price: faker.finance.amount(0, 100),
        type: typeProduct.PERECEDEROS,
        stores: [],
      });
      productList.push(product);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductEntity = productList[0];
    const product: ProductEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name);
    expect(product.price).toEqual(storedProduct.price);
    expect(product.type).toEqual(storedProduct.type);
    expect(product.stores).toEqual(storedProduct.stores);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('create should return a new product', async () => {
    const product: ProductEntity = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      price: faker.finance.amount(),
      type: typeProduct.NO_PERECEDEROS,
      stores: [],
    };

    const newProduct: ProductEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductEntity = await service.findOne(newProduct.id);
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name);
    expect(storedProduct.price).toEqual(newProduct.price);
  });

  it('update should modify a product', async () => {
    const product: ProductEntity = productList[0];
    product.name = 'New name';
    product.price = '567.10';
    const updatedProduct: ProductEntity = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    const storedProduct: ProductEntity = await service.findOne(product.id);
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(product.name);
    expect(storedProduct.price).toEqual(product.price);
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: ProductEntity = productList[0];
    product = {
      ...product,
      name: 'New name',
      price: '567.10',
    };
    await expect(() => service.update('0', product)).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('delete should remove a product', async () => {
    const product: ProductEntity = productList[0];
    await service.delete(product.id);
    try {
      await service.findOne(product.id);
    } catch {
      const storedProducts: ProductEntity[] = await service.findAll();
      expect(storedProducts.length).toEqual(4);
    }
  });

  it('delete should throw an exception for an invalid product', async () => {
    const product: ProductEntity = productList[0];
    await service.delete(product.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
});

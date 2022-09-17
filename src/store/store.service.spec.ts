import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';
import { faker } from '@faker-js/faker';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storeList: StoreEntity[];

  const seedDatabase = async () => {
    repository.clear();
    storeList = [];
    for (let i = 0; i < 5; i++) {
      const store: StoreEntity = await repository.save({
        id: faker.datatype.uuid(),
        name: faker.lorem.sentence(),
        city: faker.lorem.word(3),
        address: faker.lorem.sentence(),
        products: [],
      });
      storeList.push(store);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(
      getRepositoryToken(StoreEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all stores', async () => {
    const stores: StoreEntity[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores).toHaveLength(storeList.length);
  });

  it('findOne should return a store by id', async () => {
    const storedStore: StoreEntity = storeList[0];
    const store: StoreEntity = await service.findOne(storedStore.id);
    expect(store).not.toBeNull();
    expect(store.name).toEqual(storedStore.name);
    expect(store.city).toEqual(storedStore.city);
    expect(store.address).toEqual(storedStore.address);
    expect(store.products).toEqual(storedStore.products);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('create should return a new store', async () => {
    const store: StoreEntity = {
      id: faker.datatype.uuid(),
      name: faker.lorem.sentence(),
      city: faker.lorem.word(3),
      address: faker.lorem.sentence(),
      products: [],
    };

    const newStore: StoreEntity = await service.create(store);
    expect(newStore).not.toBeNull();

    const storedStore: StoreEntity = await service.findOne(newStore.id);
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(newStore.name);
    expect(storedStore.city).toEqual(newStore.city);
    expect(storedStore.address).toEqual(newStore.address);
  });

  it('update should modify a store', async () => {
    const store: StoreEntity = storeList[0];
    store.name = 'New name';
    store.address = 'New address';
    const updatedStore: StoreEntity = await service.update(store.id, store);
    expect(updatedStore).not.toBeNull();
    const storedStore: StoreEntity = await service.findOne(store.id);
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(store.name);
    expect(storedStore.address).toEqual(store.address);
  });

  it('update should throw an exception for an invalid store', async () => {
    let store: StoreEntity = storeList[0];
    store = {
      ...store,
      name: 'New name',
      address: 'New address',
    };
    await expect(() => service.update('0', store)).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });

  it('delete should remove a store', async () => {
    const store: StoreEntity = storeList[0];
    await service.delete(store.id);
    try {
      await service.findOne(store.id);
    } catch {
      const storedStores: StoreEntity[] = await service.findAll();
      expect(storedStores.length).toEqual(4);
    }
  });

  it('delete should throw an exception for an invalid store', async () => {
    const store: StoreEntity = storeList[0];
    await service.delete(store.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The store with the given id was not found',
    );
  });
});

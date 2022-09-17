import { StoreEntity } from 'src/store/store.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum typeProduct {
  PERECEDEROS = 'Perecedero',
  NO_PERECEDEROS = 'No perecedero',
}

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column()
  type: typeProduct;

  @ManyToMany(() => StoreEntity, (store) => store.products)
  @JoinTable()
  stores: StoreEntity[];
}

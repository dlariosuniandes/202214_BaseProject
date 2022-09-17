import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { typeProduct } from './product.entity';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEnum(typeProduct)
  @IsNotEmpty()
  readonly type: typeProduct;

  @IsString()
  @IsNotEmpty()
  readonly price: string;
}

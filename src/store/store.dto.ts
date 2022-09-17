import { IsNotEmpty, IsString } from 'class-validator';

export class StoreDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;
}

import { ProductStatus } from '../product-status.enum';
import { IsOptional, IsIn, IsEmpty, IsNotEmpty } from 'class-validator';
export class GetProductFilterDto{
    @IsOptional()
    @IsIn( [ProductStatus.AVAILABLE, ProductStatus.ORDERED, ProductStatus.SHIPPING, ProductStatus.FINISHED] )
    @IsNotEmpty()
    status: ProductStatus;

    search: string;

    price: number;
}
import {IsNotEmpty} from 'class-validator'

export class CreateOrderDto{
    @IsNotEmpty()
    orderId: string;
    @IsNotEmpty()
    userId: number;
}

export class CreateOrderListDto{
    @IsNotEmpty()
    orderId: number;
    @IsNotEmpty()
    userId: number;
    @IsNotEmpty()
    productId: number;
    @IsNotEmpty()
    quality: number;
    @IsNotEmpty()
    price: number;
}
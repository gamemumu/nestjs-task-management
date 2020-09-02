import { Repository, EntityRepository } from "typeorm"
import { CreateOrderDto, CreateOrderListDto } from './dto/create-order.dto';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/user.entity';
import { Order, OrderList } from './order.entity';
import { Product } from '../products/product.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order>{
    private logger = new Logger('OrderRepository');


    async createOrder(
        createOrderListDto: CreateOrderListDto,
        user: User,
    ): Promise<Order>{
        const{ orderId, userId, productId, quality} = createOrderListDto;

        const order = new Order();
        order.userId = userId;
        await order.save();

        const orderLs = new OrderList();
        const product = new Product();
        product.id  = productId;
        orderLs.orderId = order.orderId;
        orderLs.quality = quality;
        orderLs.products.push(product);
        
        
        try{
            await orderLs.save();
        }catch(error){
            this.logger.error(`Failed to create a Order for userr "${user.username}". Data: ${createOrderListDto}`, error.stack)
            throw new InternalServerErrorException();
        }
        return order;
    }
    
}
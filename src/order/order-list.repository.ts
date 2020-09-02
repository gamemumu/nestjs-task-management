import { Repository, EntityRepository } from "typeorm"
import { CreateOrderDto, CreateOrderListDto } from './dto/create-order.dto';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/user.entity';
import { Order, OrderList } from './order.entity';
import { Product } from '../products/product.entity';

@EntityRepository(OrderList)
export class OrderListRepository extends Repository<OrderList>{
    private logger = new Logger('OrderRepository');
    
}
import { Injectable, NotFoundException, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { Order, OrderList } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { CreateOrderListDto } from './dto/create-order.dto';
import { GetUser } from '../auth/get-user-decorator';
import { OrderListRepository } from './order-list.repository';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderRepository)
        private orderRepository: OrderRepository,
        @InjectRepository(OrderListRepository)
        private orderListRepository: OrderListRepository
    ){}   

    async getOrderHistory( //เรียกดู Order history ของตัวเอง
        user: User,
    ): Promise<Order>{
        const order = await this.orderRepository.findOne(user.id);
        
        if(!order){
            throw new NotFoundException(`Order with ID  "${user.id}" not found`);
        }
        return order;
    }

    async getOrderDetails(
        id: number,
        @GetUser() user: User,
    ): Promise<OrderList>{
        const found = await this.orderListRepository.findOne({ where: {id, userId: user.id }});
        if(!found){
            throw new NotFoundException(`Oder with ID  "${id}" not found`);
        }
        return found;
    }
    
    async createOrder(
        createOrderListDto: CreateOrderListDto,
        user: User,
    ): Promise<Order>{
       return this.orderRepository.createOrder(createOrderListDto, user);
    }

    async cancelOrder(
        id: number,
        @GetUser() user: User,
    ): Promise<void>{
       const result = await this.orderRepository.delete(id);
       if(result.affected ===0){
         throw new NotFoundException(`Order with ID  "${id}" not found`);
       }
    }



}

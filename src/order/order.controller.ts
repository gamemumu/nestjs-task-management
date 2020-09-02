import { Controller, Get, Logger, Post, UsePipes, Body, ValidationPipe, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, CreateOrderListDto } from './dto/create-order.dto';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';
import { Order, OrderList } from './order.entity';

@Controller('order')
export class OrderController {
    private logger = new Logger('ProductController');
    constructor(private orderService: OrderService,){}

    //เรียกดู Order history ของตัวเอง
    @Get()
    getOrderHistory(
        @GetUser() user: User,
    ){
        return this.orderService.getOrderHistory(user);
    }

    //ดูรายละเอียดคำสั่งซื้อ
    @Get('/:id')
    getOrderDetails(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<OrderList>{
        return this.orderService.getOrderDetails(id, user);
    }

    //สร้างรายการคำสั่งซื้อได้
    @Post()
    @UsePipes(ValidationPipe)
    createOrder(
        @Body() createOrderListDto: CreateOrderListDto,
        @GetUser()user: User,
    ): Promise<Order>{
        this.logger.verbose(`User "${user.username}" creating  a new Order. Data: ${JSON.stringify(createOrderListDto)}`);
        return this.orderService.createOrder(createOrderListDto, user);
    }

    //ยกเลิกคำสั่งซื้อ
    @Delete('/:id')
    cancelOrder(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void>{
        return this.orderService.cancelOrder(id, user);
    }




}
   
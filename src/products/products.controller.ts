import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductFilterDto } from './dto/get-product.filter.dto';
import { ProductStatusValidationPipe } from './pipes/products-status-validation.pipe';
import { Product } from './product.entity';
import { ProductStatus } from './product-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from 'src/auth/get-user-decorator';
import { create } from 'domain';

@Controller('products')
@UseGuards(AuthGuard())
export class ProductsController {
    private logger = new Logger('ProductController');
    constructor(private productsService: ProductsService){}   
    
    //เรียกดู Product ทั้งหมดที่มีในระบบ
    @Get()
    getProducts(
        @Query(ValidationPipe) filterDto: GetProductFilterDto,
    ){
        this.logger.verbose(`Products.Filter: ${JSON.stringify(filterDto)}`);
        return this.productsService.getProduct(filterDto);
    }
    
    //สามารถดูข้อมูลของแต่ละ Product ได้
    @Get('/:id')
    getProductById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Product>{
        return this.productsService.getProductById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createProduct(
        @Body() createProductDto: CreateProductDto,
        @GetUser()user: User,
    ): Promise<Product>{
        this.logger.verbose(`User "${user.username}" creating  a new Product. Data: ${JSON.stringify(createProductDto)}`);
        return this.productsService.createProduct(createProductDto, user);
    }

    @Delete('/:id')
    deleteProduct(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void>{
        return this.productsService.deleteProduct(id, user);
    }

    @Patch('/:id/status')
    updateProductStatus(
        @Param('id', ParseIntPipe) id: number, 
        @Body('status', ProductStatusValidationPipe) status: ProductStatus,
        @GetUser() user: User,
        ) : Promise<Product>{
        return this.productsService.updateProductStatus(id, status, user);
    }

}

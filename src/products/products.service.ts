import { Injectable, Get, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductFilterDto } from './dto/get-product.filter.dto';
import { ProductRepository } from './products.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductStatus } from './product-status.enum';
import { create } from 'domain';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user-decorator';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository
    ){}   
    
    getProduct(
        filterDto: GetProductFilterDto,
    ): Promise<Product[]>{
        return this.productRepository.getProducts(filterDto);
    }

    async getProductById(
        id: number,
    ): Promise<Product>{
        const found = await this.productRepository.findOne(id);
        
        if(!found){
            throw new NotFoundException(`Product with ID  "${id}" not found`);
        }

        return found;
    }

    async createProduct(
        createproducyDto: CreateProductDto,
        user: User,
    ): Promise<Product>{
       return this.productRepository.createProduct(createproducyDto, user);
    }

    async deleteProduct(
        id: number,
        @GetUser() user: User,
    ): Promise<void>{
       const result = await this.productRepository.delete(id);
       if(result.affected ===0){
         throw new NotFoundException(`Product with ID  "${id}" not found`);
       }
    }

    async updateProductStatus(
        id:number, 
        status: ProductStatus,
        @GetUser() user: User): Promise<Product>{
        const product = await this.getProductById(id);
        product.status = status;
        await product.save();
        return product;
    }

}

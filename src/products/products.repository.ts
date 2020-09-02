import { Repository, EntityRepository } from "typeorm";
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from './product-status.enum';
import { Delete, Logger, InternalServerErrorException } from '@nestjs/common';
import { GetProductFilterDto } from './dto/get-product.filter.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product>{
    private logger = new Logger('ProductRepository');

    //เรียกดู Product ทั้งหมดที่มีในระบบ
    async getProducts(
        filterDto: GetProductFilterDto,
    ): Promise<Product[]>{
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('Product');

        query.where('');

        if(status) {
            query.andWhere('Product.status = :status', { status });
        }

        if(search) {
            query.andWhere('(Product.title LIKE :search OR Product.description LIKE :search)', { search: `%${search}%` });
        }
        

        try{
            const Products = query.getMany();
            return Products;
        }catch(error){
            this.logger.error(`Failed to get Products, Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
    
    async createProduct(
        createProductDto: CreateProductDto,
        user: User,
    ): Promise<Product>{
        const{ title, description } = createProductDto;

        const product = new Product();
        product.title = title;
        product.description = description;
        product.status = ProductStatus.AVAILABLE;
        
        try{
        await product.save();
        }catch(error){
            this.logger.error(`Failed to create a Product for userr "${user.username}". Data: ${createProductDto}`, error.stack)
            throw new InternalServerErrorException();
        }

        return product;
    }
}
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../auth/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order extends BaseEntity{
    @PrimaryGeneratedColumn()
    orderId: number;

    userId: number;
}

@Entity()
export class OrderList extends BaseEntity{
    orderId: number;
    quality: number;
    @OneToMany(type => Product, products => products.id, { eager: true })
    products: Product[];
}
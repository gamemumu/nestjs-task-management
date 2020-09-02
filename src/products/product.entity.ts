import {  Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { ProductStatus } from "./product-status.enum";
import { User } from '../auth/user.entity';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title:string;

    @Column()
    description:string;

    @Column()
    status: ProductStatus;

    @Column()
    price: number;
}
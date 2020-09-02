import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Product } from '../products/product.entity';
import { Order } from '../order/order.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    salt:string;

    @OneToMany(type => Order, orders => orders.userId, { eager: true })
    orders: Order[];

    async validatePassword(password: string ): Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
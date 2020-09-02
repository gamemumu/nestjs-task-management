import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ProductStatus } from '../product-status.enum';

export class ProductStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        ProductStatus.AVAILABLE,
        ProductStatus.ORDERED,
        ProductStatus.SHIPPING,
        ProductStatus.FINISHED,
    ];
    
    transform(value: any){
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException(`"${value}" is an invalid status`);
        }
        return value;
    }

    private isStatusValid(status: any){
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}
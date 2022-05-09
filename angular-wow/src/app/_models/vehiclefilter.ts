export class VehicleFilter {
    typeID: string;
    checked: boolean;
    carType: string;
    qty: number;
    price: number

    constructor(typeID: string, checked: boolean, carType: string, qty: number, price: number){
        this.typeID = typeID;
        this.checked = checked;
        this.carType = carType;
        this.qty = qty;
        this.price = price;
    }
}

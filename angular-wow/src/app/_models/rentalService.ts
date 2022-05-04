export class RentalService {
    pickUpLoc: number;
    pickUpDate: Date;
    dropOffLoc: number;
    dropOffDate: Date;
    startODO: number;
    endODO: number;
    vehicleVIN: string;
    dailyCap: number;
    couponCode?: string;
    paymentMethod: number;
    cardNumber: string;
    totalRate: number;
    discount: number;
    corporateOrder: boolean;
    insureName: string;
    insureNumber: string;

    constructor(pickUpLoc, pickUpDate, dropOffLoc, dropOffDate, startODO, endODO, vehicleVIN, dailyCap,
                paymentMethod, cardNumber, totalRate, discount, corporateOrder, insureName, insureNumber) {
        this.pickUpLoc = pickUpLoc;
        this.pickUpDate = new Date(pickUpDate);
        this.dropOffLoc = dropOffLoc;
        this.dropOffDate = new Date(dropOffDate);
        this.startODO = startODO;
        this.endODO = endODO;
        this.vehicleVIN = vehicleVIN;
        this.dailyCap = dailyCap;
        this.paymentMethod = paymentMethod;
        this.cardNumber = cardNumber;
        this.totalRate = totalRate;
        this.discount = discount;
        this.corporateOrder = corporateOrder;
        this.insureName = insureName;
        this.insureNumber = insureNumber;
    }

}

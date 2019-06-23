import { Log } from "./log";
import {
    IDeleteOrderRequest,
    IGetOrderByIdRequest,
    IGetOrdersRequest,
    IOrder,
    IOrders,
    IPlaceOrderRequest,
    ISwaggerPetstoreServiceService,
    Status,
} from "./petstore.spec";

export class Service implements ISwaggerPetstoreServiceService {
    public DeleteOrder(r: IDeleteOrderRequest): void {
        throw new Error("not implemented");
        Log.Log(r);
    }

    public GetOrderById(r: IGetOrderByIdRequest): IOrder {
        throw new Error("not implemented");
        Log.Log(r);
    }
    public GetOrders(r: IGetOrdersRequest): IOrders {
        Log.Log(r);
        const orders: IOrders = {
            orders: [
                {
                    complete: true,
                    id: 1,
                    petId: 1,
                    quantity: 1,
                    shipDate: new Date().toUTCString(),
                    status: Status.PLACED,
                },
            ],
        };
        return orders;
    }
    public PlaceOrder(r: IPlaceOrderRequest): IOrder {
        throw new Error("not implemented");
        Log.Log(r);
    }
}

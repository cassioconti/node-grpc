import * as protoLoader from "@grpc/proto-loader";
import express from "express";
import * as grpc from "grpc";

import { Log } from "./log";
import {
    IDeleteOrderRequest,
    IGetOrderByIdRequest,
    IGetOrdersRequest,
    IOrder,
    IOrders,
    IPlaceOrderRequest,
} from "./petstore.spec";
import { Service } from "./service";

const service: Service = new Service();

protoLoader.load("spec.proto").then((spec) => {
    const packageDefinition: any = grpc.loadPackageDefinition(spec);
    const server = new grpc.Server();

    // Server
    server.addService(packageDefinition.swaggerpetstore.SwaggerPetstoreService.service, {
        DeleteOrder: (
            call: grpc.ServerUnaryCall<IDeleteOrderRequest>,
            callback: (error: grpc.ServiceError | null, value: void) => void) =>
            GrpcRequestWrapper<IDeleteOrderRequest, void>(service.DeleteOrder, call, callback),

        GetOrderById: (
            call: grpc.ServerUnaryCall<IGetOrderByIdRequest>,
            callback: (error: grpc.ServiceError | null, value: IOrder) => void) =>
            GrpcRequestWrapper<IGetOrderByIdRequest, IOrder>(service.GetOrderById, call, callback),

        GetOrders: (
            call: grpc.ServerUnaryCall<IGetOrdersRequest>,
            callback: (error: grpc.ServiceError | null, value: IOrders) => void) =>
            GrpcRequestWrapper<IGetOrdersRequest, IOrders>(service.GetOrders, call, callback),

        PlaceOrder: (
            call: grpc.ServerUnaryCall<IPlaceOrderRequest>,
            callback: (error: grpc.ServiceError | null, value: IOrder) => void) =>
            GrpcRequestWrapper<IPlaceOrderRequest, IOrder>(service.PlaceOrder, call, callback),
    });
    server.bind("localhost:50051", grpc.ServerCredentials.createInsecure());
    Log.Log("gRPC server running at http://localhost:50051");
    server.start();

    // Client
    const client = new packageDefinition.swaggerpetstore.SwaggerPetstoreService("localhost:50051",
        grpc.credentials.createInsecure());
    const getOrdersRequest: IGetOrdersRequest = { limit: 10 };
    client.GetOrders(getOrdersRequest, (err: Error, resp: IOrders) => {
        if (err) { Log.Log(err); }
        Log.Log(resp);
        Log.Log(JSON.stringify(resp));
    });
});

const app = express();
app.get("/orders", (req, res) => HttpRequestWrapper<IGetOrdersRequest, IOrders>(service.GetOrders, req, res));
app.listen(8081, () => Log.Log("HTTP server running at http://localhost/8081"));

function GrpcRequestWrapper<TReq, TRes>(
    endpointHandler: (req: TReq) => TRes,
    call: grpc.ServerUnaryCall<TReq>,
    callback: (error: grpc.ServiceError | null, value: TRes) => void): void {
    const response = endpointHandler(call.request);
    callback(null, response);
}

function HttpRequestWrapper<TReq, TRes>(
    endpointHandler: (req: TReq) => TRes,
    req: express.Request,
    res: express.Response) {
    const response = endpointHandler(req.body);
    res.status(200).send(response);
}

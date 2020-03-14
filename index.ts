import grpc from "grpc";
import { Client } from "./client";
import { Log } from "./log";
import { IServerImplementation, Server } from "./server";

class Index {
    private static readonly PROTO_PATH: string = "./protos/service.proto";
    private static readonly PACKAGE_NAME: string[] = ["com", "example", "mypackage"];
    private static readonly SERVICE_NAME: string = "EchoService";

    public run = (): void => {
        const implementation: IServerImplementation = {
            Echo: this.echo,
            EchoBackwards: this.echoBackwards,
        };

        // Start server
        const server: Server = new Server(Index.PROTO_PATH, Index.PACKAGE_NAME, Index.SERVICE_NAME, implementation);
        server.start();

        // Run client
        const client: Client = new Client(Index.PROTO_PATH, Index.PACKAGE_NAME, Index.SERVICE_NAME);
        const metadata: grpc.Metadata = new grpc.Metadata();
        metadata.set("authorization", "Bearer token");
        metadata.set("my-header", "my value");
        client.getGrpcClient().echo({ message: "oi" }, metadata, this.handleResponse);
        client.getGrpcClient().echoBackwards({ message: "oi" }, this.handleResponse);
    }

    private echo = (call: grpc.ServerUnaryCall<any>, callback: (err: any, resp: any) => void): void => {
        Log.info("[server] request: " + JSON.stringify(call, null, 2));
        const metadata: grpc.Metadata = call.metadata;
        Log.info("[server] headers: " + JSON.stringify(metadata.getMap(), null, 2));
        callback(null, call.request);
        // https://developers.google.com/maps-booking/reference/grpc-api-v2/status_codes
        // callback({ code: grpc.status.PERMISSION_DENIED, message: "Testing error messages." }, call.request);
    }

    private echoBackwards = (call: any, callback: (err: any, resp: any) => void): void => {
        Log.info("[server] request: " + JSON.stringify(call.request, null, 2));
        call.request.message = call.request.message.split("").reverse().join("");
        callback(null, call.request);
    }

    private handleResponse = (err: any, resp: any): void => {
        Log.info("[client] err: " + err);
        Log.info("[client] resp: " + JSON.stringify(resp, null, 2));
    }
}

const index = new Index();
index.run();

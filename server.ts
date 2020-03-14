import * as protoLoader from "@grpc/proto-loader";
import grpc from "grpc";
import { Log } from "./log";

export interface IServerImplementation {
    [methodName: string]: (err: any, resp: any) => void;
}

export class Server {
    public static readonly SERVER_PORT: number = 9090;
    private readonly grpcServer: grpc.Server;

    constructor(protoFile: string, packageName: string[], serviceName: string, implementation: IServerImplementation) {
        const options: protoLoader.Options = {
            defaults: true,
            enums: String,
            keepCase: true,
            longs: String,
            oneofs: true,
        };
        const packageDefinition = protoLoader.loadSync(protoFile, options);
        const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
        let protoPackage: any = protoDescriptor;
        packageName.forEach((packagePath) => protoPackage = protoPackage[packagePath]);

        this.grpcServer = new grpc.Server();
        this.grpcServer.addService(protoPackage[serviceName].service, implementation);
        this.grpcServer.bind(`0.0.0.0:${Server.SERVER_PORT}`, grpc.ServerCredentials.createInsecure());
    }

    public start = (): void => {
        this.grpcServer.start();
        Log.info(`Server started on port ${Server.SERVER_PORT}`);
    }

    public tryShutdown = (): void => {
        this.grpcServer.tryShutdown(() => Log.info("Server stopped"));
    }
}

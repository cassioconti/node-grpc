import * as protoLoader from "@grpc/proto-loader";
import grpc from "grpc";

export class Client {
    private grpcClient: any;

    constructor(protoFile: string, packageName: string[], serviceName: string) {
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

        this.grpcClient = new protoPackage[serviceName]("localhost:9090", grpc.credentials.createInsecure());
    }

    public getGrpcClient = (): any => this.grpcClient;
}

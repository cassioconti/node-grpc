# Node gRPC HTTP reverse proxy

Example using NodeJS, Typescript, gRPC, HTTP reverse proxy Golang.
Uses custom header matcher to translate HTTP header to gRPC.

## Protoc - generate gRPC stub

```
mkdir -p dist/protos
```

```
protoc -I/usr/local/include -I. \
  -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
  -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway \
  --go_out=plugins=grpc:dist/ \
  protos/service.proto
```

## Protoc - Generate reverse-proxy

```
protoc -I/usr/local/include -I. \
  -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
  -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway \
  --grpc-gateway_out=logtostderr=true:dist/ \
  protos/service.proto
```

## Run reverse-proxy

```
mkdir -p $GOPATH/src/my-proxy \
&& cp -r dist/protos $GOPATH/src/my-proxy \
&& cp main.go $GOPATH/src/my-proxy \
&& go build -o dist/proxy $GOPATH/src/my-proxy \
&& ./dist/proxy
```

## Protoc - generate swagger

```
protoc -I/usr/local/include -I. \
  -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
  -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway \
  --swagger_out=logtostderr=true,allow_merge:dist/ \
  protos/service.proto
```

## Protoc - generate typescript interfaces
protoc -I. \
  -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis \
  -I$GOPATH/src/github.com/grpc-ecosystem/grpc-gateway \
  --tstypes_out=dist/ \
  protos/service.proto

import { APIGatewayProxyEvent } from "aws-lambda";

const mockEventGeneric: APIGatewayProxyEvent = {
  body: JSON.stringify({
    title: "Task Title",
    description: "Task Description",
    status: "in-progress",
  }),
  pathParameters: { id: "12345" },
  headers: {},
  multiValueHeaders: {},
  httpMethod: "POST",
  isBase64Encoded: false,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  path: "/tasks",
  stageVariables: null,
  requestContext: {
    accountId: "123456789012",
    apiId: "xyz123",
    authorizer: {
      principalId: "user123",
      claims: {
        sub: "user-sub",
      },
      type: {
        protocol: "Cognito",
        path: "API",
        requestEpoch: "1618398137",
      },
    },
    identity: {
      cognitoIdentityPoolId: "us-east-1:pool123",
      accountId: "123456789012",
      cognitoIdentityId: "identity-id",
      caller: "caller-id",
      apiKey: "api-key",
      sourceIp: "127.0.0.1",
      userAgent: "Mozilla/5.0",
      user: "user-id",
      accessKey: "access-key",
      apiKeyId: "api-key-id",
      clientCert: {
        clientCertPem:
          "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7lOmT6X9gZsImzZ46hF8lDN5IdXQ8h2xhpkhNyzc4g6wpTzoAcFGPGHBGF3Gv6Wf06wLzLXP4bnZ7GR2o4mSOu1FqT5zV6Q1sMpkm2zpSxlV0ysqFWeJlWiBUoAukMO6ZXN9hlNEc/x12jP9L2FIfZG3yq97I06GbJpZAWAVMmOMqLU9mK1RtL1xPbDDGJ5tXs6G0wnptMfQGbmrYrFgEBkI7zVhA1zpDr1pV7npnLR3ZmaVntljtsWq4YN10yb65yZjFgYxAWPHmOd9uJGlZT0yobHqQb5gExDWLbHtNiRztbuW9c4v0AhfrZg94cPkcRnyvTAe2glK42eA6reYH3bZ9+dLOIo4ty6W0KKY3qA==",
        serialNumber: "1234567890",
        subjectDN: "CN=example.com, O=Example Org, C=US",
        issuerDN: "CN=Example CA, O=Certificate Authority, C=US",
        validity: {
          notBefore: "2022-01-01T00:00:00Z",
          notAfter: "2023-01-01T00:00:00Z",
        },
      },
      cognitoAuthenticationProvider: "provider",
      cognitoAuthenticationType: "type",
      principalOrgId: null,
      userArn: "arn:aws:iam::123456789012:user/user-id",
    },
    stage: "dev",
    requestId: "xyz123-request",
    resourceId: "resource-id",
    resourcePath: "/tasks",
    httpMethod: "POST",
    protocol: "HTTP/1.1",
    path: "/tasks",
    requestTimeEpoch: 1618398137,
  },
  resource: "/tasks",
};

export { mockEventGeneric };

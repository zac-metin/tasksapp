import { handler } from "./index";
import AWS from "aws-sdk";
import AWSMock from "aws-sdk-mock";
import { APIGatewayProxyEvent } from "aws-lambda";

// Mock DynamoDB
AWSMock.setSDKInstance(AWS);
const mockDynamoDB = new AWS.DynamoDB.DocumentClient();

beforeAll(() => {
  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "scan",
    jest.fn().mockResolvedValue({ Items: [{ taskId: "1", title: "Task 1" }] })
  );
  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "get",
    jest.fn().mockImplementation((params, callback) => {
      if (params.Key.taskId === "1") {
        callback(null, { Item: { taskId: "1", title: "Task 1" } });
      } else {
        callback(null, {});
      }
    })
  );
  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "put",
    jest.fn().mockResolvedValue({})
  );
  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "update",
    jest
      .fn()
      .mockResolvedValue({ Attributes: { taskId: "1", title: "Updated Task" } })
  );
  AWSMock.mock(
    "DynamoDB.DocumentClient",
    "delete",
    jest.fn().mockResolvedValue({})
  );
});

afterAll(() => {
  AWSMock.restore("DynamoDB.DocumentClient");
});

const mockEvent = (
  method: string,
  pathParams?: object,
  body?: object
): APIGatewayProxyEvent => ({
  httpMethod: method,
  pathParameters: pathParams,
  body: body ? JSON.stringify(body) : null,
  queryStringParameters: null,
  headers: {},
  multiValueHeaders: {},
  requestContext: {} as any,
  resource: "",
  isBase64Encoded: false,
  stageVariables: null,
});

test("GET /tasks - Retrieves all tasks", async () => {
  const result = await handler(mockEvent("GET"));
  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body)).toEqual([{ taskId: "1", title: "Task 1" }]);
});

test("GET /tasks/:id - Retrieves a task", async () => {
  const result = await handler(mockEvent("GET", { id: "1" }));
  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body)).toEqual({ taskId: "1", title: "Task 1" });
});

test("GET /tasks/:id - Task not found", async () => {
  const result = await handler(mockEvent("GET", { id: "999" }));
  expect(result.statusCode).toBe(404);
});

test("POST /tasks - Creates a task", async () => {
  const newTask = {
    title: "New Task",
    description: "Task description",
    status: "pending",
  };
  const result = await handler(mockEvent("POST", {}, newTask));
  expect(result.statusCode).toBe(201);
  expect(JSON.parse(result.body)).toHaveProperty("taskId");
});

test("PUT /tasks/:id - Updates a task", async () => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated description",
    status: "done",
  };
  const result = await handler(mockEvent("PUT", { id: "1" }, updatedTask));
  expect(result.statusCode).toBe(200);
  expect(JSON.parse(result.body)).toEqual({
    taskId: "1",
    title: "Updated Task",
  });
});

test("DELETE /tasks/:id - Deletes a task", async () => {
  const result = await handler(mockEvent("DELETE", { id: "1" }));
  expect(result.statusCode).toBe(204);
});

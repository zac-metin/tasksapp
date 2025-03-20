// import { handler } from "../updateTask";
// import { APIGatewayProxyEvent } from "aws-lambda";
// import AWS from "aws-sdk";
// import { mockEventGeneric } from "./mockEvent";

// jest.mock("aws-sdk", () => {
//   const mockDynamoDB = {
//     DocumentClient: jest.fn().mockImplementation(() => ({
//       update: jest.fn().mockReturnValue({
//         promise: jest.fn().mockResolvedValue({
//           Attributes: { taskId: "123", title: "Updated Task" },
//         }),
//       }),
//     })),
//   };
//   return { DynamoDB: mockDynamoDB };
// });

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// describe("Handler tests", () => {
//   const mockEvent = (body: string, pathParameters: { id: string }) =>
//     ({
//       ...mockEventGeneric,
//       body,
//       pathParameters,
//     } as APIGatewayProxyEvent);

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should return 400 if request body is missing", async () => {
//     const event = mockEvent("", { id: "123" });

//     const result = await handler(event);

//     expect(result.statusCode).toBe(400);
//     expect(result.body).toContain("Request body required");
//   });

//   it("should return 400 if required fields are missing in the body", async () => {
//     const event = mockEvent(JSON.stringify({ title: "Test Task" }), {
//       id: "123",
//     });

//     const result = await handler(event);

//     expect(result.statusCode).toBe(400);
//     expect(result.body).toContain("Missing required fields: status");
//   });

//   it("should return 400 if task ID is missing", async () => {
//     const event = mockEvent(
//       JSON.stringify({ title: "Test Task", status: "open" }),
//       { id: 'undefined; }
//     );

//     const result = await handler(event);

//     expect(result.statusCode).toBe(400);
//     expect(result.body).toContain("Task ID is required");
//   });

//   it("should update task successfully", async () => {
//     const event = mockEvent(
//       JSON.stringify({
//         title: "Updated Task",
//         description: "Updated description",
//         status: "completed",
//       }),
//       { id: "123" }
//     );

//     dynamoDb.update.mockReturnValue({
//       promise: jest.fn().mockResolvedValue({
//         Attributes: { taskId: "123", title: "Updated Task" },
//       }),
//     });

//     const result = await handler(event);

//     expect(result.statusCode).toBe(200);
//     expect(result.body).toContain("Updated Task");
//     expect(dynamoDb.update).toHaveBeenCalledTimes(1);
//     expect(dynamoDb.update).toHaveBeenCalledWith({
//       TableName: "tasks",
//       Key: { taskId: "123" },
//       UpdateExpression:
//         "set title = :title, description = :desc, status = :status",
//       ExpressionAttributeValues: {
//         ":title": "Updated Task",
//         ":desc": "Updated description",
//         ":status": "completed",
//       },
//       ReturnValues: "ALL_NEW",
//     });
//   });
// });

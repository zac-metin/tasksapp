import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "tasks";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { httpMethod, pathParameters, body } = event;

  switch (httpMethod) {
    case "GET":
      if (pathParameters && pathParameters.id) {
        return getTask(pathParameters.id);
      }
      return getAllTasks();
    case "POST":
      return createTask(body);
    case "PUT":
      if (!pathParameters || !pathParameters.id) {
        return createResponse(400, { message: "Task ID required" });
      }
      return updateTask(pathParameters.id, body);
    case "DELETE":
      if (!pathParameters || !pathParameters.id) {
        return createResponse(400, { message: "Task ID required" });
      }
      return deleteTask(pathParameters.id);
    default:
      return createResponse(405, { message: "Method Not Allowed" });
  }
};

const getAllTasks = async () => {
  const params = { TableName: TABLE_NAME };
  const result = await dynamoDb.scan(params).promise();
  return createResponse(200, result.Items);
};

const getTask = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { taskId: id },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item
    ? createResponse(200, result.Item)
    : createResponse(404, { message: "Task not found" });
};

const createTask = async (body: string | null) => {
  if (!body) return createResponse(400, { message: "Request body required" });

  const { title, description, status } = JSON.parse(body);
  const taskId = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: { taskId, title, description, status },
  };

  await dynamoDb.put(params).promise();
  return createResponse(201, { taskId, title, description, status });
};

const updateTask = async (id: string, body: string | null) => {
  if (!body) return createResponse(400, { message: "Request body required" });

  const { title, description, status } = JSON.parse(body);
  const params = {
    TableName: TABLE_NAME,
    Key: { taskId: id },
    UpdateExpression: "set title = :t, description = :d, status = :s",
    ExpressionAttributeValues: {
      ":t": title,
      ":d": description,
      ":s": status,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDb.update(params).promise();
  return createResponse(200, result.Attributes);
};

const deleteTask = async (id: string) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { taskId: id },
  };

  await dynamoDb.delete(params).promise();
  return createResponse(204, {});
};

const createResponse = (statusCode: number, body: object) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

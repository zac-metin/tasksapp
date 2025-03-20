import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "tasks";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { body } = event;
    if (!body) {
      return createErrorResponse(400, "Request body is required");
    }

    const { title, description, status } = JSON.parse(body);

    if (!title || !status) {
      return createErrorResponse(400, "Missing required fields: title, status");
    }

    const taskId = uuidv4();
    const params = {
      TableName: TABLE_NAME,
      Item: { taskId, title, description, status },
    };

    await dynamoDb.put(params).promise();
    return createSuccessResponse(201, { taskId, title, description, status });
  } catch (error) {
    return createErrorResponse(500, "Internal Server Error");
  }
};

const createErrorResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

const createSuccessResponse = (statusCode: number, body: object) => ({
  statusCode,
  body: JSON.stringify(body),
});

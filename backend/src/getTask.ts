import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import pino from "pino";

const logger = pino({ level: "info" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "tasks";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { taskId: id },
    };
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      logger.warn({ id, message: "Task not found" });
      return createErrorResponse(404, "Task not found");
    }
    logger.info({ id, message: `Task ${id} retrieved successfully` });
    return createResponse(200, result.Item);
  } catch (error) {
    logger.error({ error, message: `Error retrieving task ${id}` });
    return createErrorResponse(500, "Could not retrieve task");
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

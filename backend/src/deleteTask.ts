import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDbClient = new DynamoDBClient({
  region: "ap-southeast-2",
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return createErrorResponse(400, "Task ID is required");
    }

    const params = new DeleteCommand({
      TableName: "tasks",
      Key: { taskId: id },
    });

    await dynamoDb.send(params);
    logger.info({ id, message: "Task deleted successfully" });

    return createSuccessResponse(204, {});
  } catch (error) {
    logger.error({
      error,
      message: `Error deleting task ${event.pathParameters?.id}`,
    });
    return createErrorResponse(500, "Could not delete task");
  }
};

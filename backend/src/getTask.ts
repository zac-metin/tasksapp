import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDbClient = new DynamoDBClient({
  region: "ap-southeast-2",
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { pathParameters } = event;

  const id = pathParameters?.id;

  if (!id) {
    logger.warn({ message: "Task ID is required" });
    return createErrorResponse(400, "Task ID is required");
  }

  try {
    const params = new GetCommand({
      TableName: "tasks",
      Key: { taskId: id },
    });

    const result = await dynamoDb.send(params);

    if (!result.Item) {
      logger.warn({ id, message: "Task not found" });
      return createErrorResponse(404, "Task not found");
    }

    logger.info({ id, message: `Task ${id} retrieved successfully` });
    return createSuccessResponse(200, result.Item);
  } catch (error) {
    logger.error({ error, message: `Error retrieving task ${id}` });
    return createErrorResponse(500, "Could not retrieve task");
  }
};

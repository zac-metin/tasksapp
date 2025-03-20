import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
    const params = {
      TableName: "tasks",
      Key: { taskId: id },
    };
    const result = await dynamoDb.get(params).promise();

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

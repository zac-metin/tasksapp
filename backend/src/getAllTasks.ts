import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDbClient = new DynamoDBClient({
  region: "ap-southeast-2",
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info({ message: "Retrieving all tasks", event });

  try {
    const params = new ScanCommand({
      TableName: "tasks",
    });

    const result = await dynamoDb.send(params);

    const taskCount = result.Items ? result.Items.length : 0;

    logger.info({
      message: `${taskCount} tasks retrieved successfully`,
      taskCount,
    });

    if (taskCount === 0) {
      logger.warn({ message: "No tasks found in the database" });
    }

    return createSuccessResponse(200, result.Items || []);
  } catch (error) {
    logger.error({ error, message: "Error retrieving all tasks" });
    return createErrorResponse(500, "Could not retrieve tasks");
  }
};

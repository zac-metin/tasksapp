import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDb = new DynamoDB.DocumentClient({
  endpoint:
    process.env.DYNAMODB_ENDPOINT ||
    "https://dynamodb.ap-southeast-2.amazonaws.com",
});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info({ message: "Retrieving all tasks", event });

  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: "tasks",
    };

    const result = await dynamoDb.scan(params).promise();

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

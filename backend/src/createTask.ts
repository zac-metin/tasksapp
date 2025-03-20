import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDb = new DynamoDB.DocumentClient({
  endpoint:
    process.env.DYNAMODB_ENDPOINT ||
    "https://dynamodb.ap-southeast-2.amazonaws.com",
});

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info({ message: "Incoming request", event });

  try {
    const { body } = event;
    if (!body) {
      logger.warn("Request body is missing");
      return createErrorResponse(400, "Request body is required");
    }

    const { title, description, status } = JSON.parse(body);

    if (!title || !status) {
      logger.warn("Missing required fields: title, status");
      return createErrorResponse(400, "Missing required fields: title, status");
    }

    const taskId = uuidv4();
    const params = {
      TableName: "tasks",
      Item: { taskId, title, description, status },
    };

    logger.info({ taskId, message: "Creating task in DynamoDB" });
    await dynamoDb.put(params).promise();

    logger.info({ taskId, message: "Task created successfully" });
    return createSuccessResponse(201, { taskId, title, description, status });
  } catch (error) {
    logger.error({ error, message: "Error creating task" });
    return createErrorResponse(500, "Internal Server Error");
  }
};

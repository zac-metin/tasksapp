import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDb = new DynamoDBClient({
  region: "ap-southeast-2",
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined, // I only want to set this when it is locally running
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
      Item: {
        taskId: { S: taskId.toString() },
        title: { S: title },
        description: { S: description },
        status: { S: status },
      },
    };

    logger.info({ taskId, message: "Creating task in DynamoDB" });
    await dynamoDb.send(new PutItemCommand(params));

    logger.info({ taskId, message: "Task created successfully" });
    return createSuccessResponse(201, { taskId, title, description, status });
  } catch (error) {
    logger.error({ error, message: "Error creating task" });
    return createErrorResponse(500, "Internal Server Error");
  }
};

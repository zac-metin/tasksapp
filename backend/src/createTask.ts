import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
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
      TableName: "tasks",
      Item: { taskId, title, description, status },
    };

    await dynamoDb.put(params).promise();
    return createSuccessResponse(201, { taskId, title, description, status });
  } catch (error) {
    return createErrorResponse(500, "Internal Server Error");
  }
};

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";

import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: "tasks",
    };

    const result = await dynamoDb.scan(params).promise();

    logger.info({
      message: `${
        result.Items ? result.Items.length : 0
      } tasks retrieved successfully`,
    });
    return createSuccessResponse(200, result.Items || []);
  } catch (error) {
    logger.error({ error, message: "Error retrieving all tasks" });
    return createErrorResponse(500, "Could not retrieve tasks");
  }
};

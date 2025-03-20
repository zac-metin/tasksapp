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
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return createErrorResponse(400, "Task ID is required");
    }

    const params = {
      TableName: "tasks",
      Key: { taskId: id },
    };

    await dynamoDb.delete(params).promise();
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

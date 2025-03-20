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
  const { body } = event;

  if (!body) return createErrorResponse(400, "Request body required");

  try {
    const parsedBody = JSON.parse(body);
    const { title, description, status } = parsedBody;

    const missingFields: string[] = [];
    if (!title) missingFields.push("title");
    if (!status) missingFields.push("status");

    if (missingFields.length > 0) {
      return createErrorResponse(
        400,
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    const id = event.pathParameters?.id;

    if (!id) {
      return createErrorResponse(400, "Task ID is required");
    }

    const params = {
      TableName: "tasks",
      Key: { taskId: id },
      UpdateExpression:
        "set title = :title, description = :desc, status = :status",
      ExpressionAttributeValues: {
        ":title": title,
        ":description": description,
        ":status": status,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    logger.info({ id, message: "Task updated successfully" });

    return createSuccessResponse(200, result.Attributes || {});
  } catch (error) {
    const id = event.pathParameters?.id;
    logger.error({ error, message: `Error updating task ${id || "unknown"}` });
    return createErrorResponse(500, "Could not update task");
  }
};

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { logger, createErrorResponse, createSuccessResponse } from "./logging";

const dynamoDbClient = new DynamoDBClient({
  region: "ap-southeast-2",
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

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

    const params = new UpdateCommand({
      TableName: "tasks",
      Key: { taskId: id },
      UpdateExpression:
        "set title = :title, description = :desc, #status = :statustext",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":title": title,
        ":desc": description,
        ":statustext": status,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDb.send(params);
    logger.info({ id, message: "Task updated successfully" });

    return createSuccessResponse(200, result.Attributes || {});
  } catch (error) {
    const id = event.pathParameters?.id;
    logger.error({ error, message: `Error updating task ${id || "unknown"}` });
    return createErrorResponse(500, "Could not update task");
  }
};

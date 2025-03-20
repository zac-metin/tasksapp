import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";
import pino from "pino";

const logger = pino({ level: "info" });
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

const createErrorResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

const createSuccessResponse = (statusCode: number, body: object) => ({
  statusCode,
  body: JSON.stringify(body),
});

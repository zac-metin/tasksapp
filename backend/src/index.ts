import { APIGatewayProxyHandler } from "aws-lambda";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import pino from "pino";

const logger = pino({ level: "info" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "tasks";

export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info({ event, message: "Incoming request" });

  try {
    const { httpMethod, pathParameters, queryStringParameters, body } = event;

    switch (httpMethod) {
      case "GET":
        if (pathParameters?.id) {
          return await getTask(pathParameters.id);
        }
        return await getAllTasks(queryStringParameters);
      case "POST":
        return await createTask(body);
      case "PUT":
        if (!pathParameters?.id)
          return createErrorResponse(400, "Task ID required");
        return await updateTask(pathParameters.id, body);
      case "DELETE":
        if (!pathParameters?.id)
          return createErrorResponse(400, "Task ID required");
        return await deleteTask(pathParameters.id);
      default:
        return createErrorResponse(405, "Method Not Allowed");
    }
  } catch (error) {
    logger.error({ error, message: "Unexpected error" });
    return createErrorResponse(500, "Internal Server Error");
  }
};

// const getTask = async (id: string) => {
//   try {
//     const params = {
//       TableName: TABLE_NAME,
//       Key: { taskId: id },
//     };

//     const result = await dynamoDb.get(params).promise();

//     if (!result.Item) {
//       logger.warn({ id, message: "Task not found" });
//       return createErrorResponse(404, "Task not found");
//     }

//     logger.info({ id, message: `Task ${id} retrieved successfully` });
//     return createResponse(200, result.Item);
//   } catch (error) {
//     logger.error({ error, message: `Error retrieving task ${id}` });
//     return createErrorResponse(500, "Could not retrieve task");
//   }
// };

const getAllTasks = async (
  queryStringParameters: { [key: string]: string } | null
) => {
  try {
    const params: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: TABLE_NAME,
    };

    if (queryStringParameters?.status) {
      params.FilterExpression = "status = :status";
      params.ExpressionAttributeValues = {
        ":status": queryStringParameters.status,
      };
    }

    const result = await dynamoDb.scan(params).promise();

    logger.info({
      message: `${
        result.Items ? result.Items.length : 0
      } tasks retrieved successfully`,
    });
    return createResponse(200, result.Items || []);
  } catch (error) {
    logger.error({ error, message: "Error retrieving all tasks" });
    return createErrorResponse(500, "Could not retrieve tasks");
  }
};

// const createTask = async (body: string | null) => {
//   if (!body) return createErrorResponse(400, "Request body required");

//   try {
//     const parsedBody = JSON.parse(body);
//     const { title, description, status } = parsedBody;

//     const missingFields: string[] = [];

//     if (!title) missingFields.push("title");
//     if (!status) missingFields.push("status");

//     if (missingFields.length > 0) {
//       return createErrorResponse(
//         400,
//         `Missing required fields: ${missingFields.join(", ")}`
//       );
//     }

//     const taskId = uuidv4();
//     const newTask = { taskId, title, description, status };

//     await dynamoDb.put({ TableName: TABLE_NAME, Item: newTask }).promise();
//     logger.info({ taskId, message: "Task created successfully" });

//     return createResponse(201, newTask);
//   } catch (error) {
//     logger.error({ error, message: "Error creating task" });
//     return createErrorResponse(500, "Could not create task");
//   }
// };

const updateTask = async (id: string, body: string | null) => {
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

    const params = {
      TableName: TABLE_NAME,
      Key: { taskId: id },
      UpdateExpression: "set title = :t, description = :d, status = :s",
      ExpressionAttributeValues: {
        ":t": title,
        ":d": description,
        ":s": status,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    logger.info({ id, message: "Task updated successfully" });

    return createResponse(200, result.Attributes || {});
  } catch (error) {
    logger.error({ error, message: `Error updating task ${id}` });
    return createErrorResponse(500, "Could not update task");
  }
};

const deleteTask = async (id: string) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { taskId: id },
    };

    await dynamoDb.delete(params).promise();
    logger.info({ id, message: "Task deleted successfully" });

    return createResponse(204, {});
  } catch (error) {
    logger.error({ error, message: `Error deleting task ${id}` });
    return createErrorResponse(500, "Could not delete task");
  }
};

const createResponse = (statusCode: number, body: object) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

const createErrorResponse = (statusCode: number, message: string) => {
  return createResponse(statusCode, { error: message });
};

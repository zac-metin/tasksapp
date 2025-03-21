"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const logging_1 = require("./logging");
const dynamoDbClient = new client_dynamodb_1.DynamoDBClient({
    region: "ap-southeast-2",
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});
const dynamoDb = lib_dynamodb_1.DynamoDBDocumentClient.from(dynamoDbClient);
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { body } = event;
    if (!body)
        return (0, logging_1.createErrorResponse)(400, "Request body required");
    try {
        const parsedBody = JSON.parse(body);
        const { title, description, status } = parsedBody;
        const missingFields = [];
        if (!title)
            missingFields.push("title");
        if (!status)
            missingFields.push("status");
        if (missingFields.length > 0) {
            return (0, logging_1.createErrorResponse)(400, `Missing required fields: ${missingFields.join(", ")}`);
        }
        const id = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.id;
        if (!id) {
            return (0, logging_1.createErrorResponse)(400, "Task ID is required");
        }
        const params = new lib_dynamodb_1.UpdateCommand({
            TableName: "tasks",
            Key: { taskId: id },
            UpdateExpression: "set title = :title, description = :desc, #status = :statustext",
            ExpressionAttributeNames: {
                "#status": "status", // We've gotta do this since status is reserved word
            },
            ExpressionAttributeValues: {
                ":title": title,
                ":description": description,
                ":statustext": status,
            },
            ReturnValues: "ALL_NEW",
        });
        const result = yield dynamoDb.send(params);
        logging_1.logger.info({ id, message: "Task updated successfully" });
        return (0, logging_1.createSuccessResponse)(200, result.Attributes || {});
    }
    catch (error) {
        const id = (_b = event.pathParameters) === null || _b === void 0 ? void 0 : _b.id;
        logging_1.logger.error({ error, message: `Error updating task ${id || "unknown"}` });
        return (0, logging_1.createErrorResponse)(500, "Could not update task");
    }
});
exports.handler = handler;

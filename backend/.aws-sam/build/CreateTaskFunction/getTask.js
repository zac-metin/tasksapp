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
    const { pathParameters } = event;
    const id = pathParameters === null || pathParameters === void 0 ? void 0 : pathParameters.id;
    if (!id) {
        logging_1.logger.warn({ message: "Task ID is required" });
        return (0, logging_1.createErrorResponse)(400, "Task ID is required");
    }
    try {
        const params = new lib_dynamodb_1.GetCommand({
            TableName: "tasks",
            Key: { taskId: id },
        });
        const result = yield dynamoDb.send(params);
        if (!result.Item) {
            logging_1.logger.warn({ id, message: "Task not found" });
            return (0, logging_1.createErrorResponse)(404, "Task not found");
        }
        logging_1.logger.info({ id, message: `Task ${id} retrieved successfully` });
        return (0, logging_1.createSuccessResponse)(200, result.Item);
    }
    catch (error) {
        logging_1.logger.error({ error, message: `Error retrieving task ${id}` });
        return (0, logging_1.createErrorResponse)(500, "Could not retrieve task");
    }
});
exports.handler = handler;

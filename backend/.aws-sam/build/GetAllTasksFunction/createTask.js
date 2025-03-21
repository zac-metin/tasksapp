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
const uuid_1 = require("uuid");
const logging_1 = require("./logging");
const dynamoDb = new client_dynamodb_1.DynamoDBClient({
    region: "ap-southeast-2",
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined, // I only want to set this when it is locally running
});
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.logger.info({ message: "Incoming request", event });
    try {
        const { body } = event;
        if (!body) {
            logging_1.logger.warn("Request body is missing");
            return (0, logging_1.createErrorResponse)(400, "Request body is required");
        }
        const { title, description, status } = JSON.parse(body);
        if (!title || !status) {
            logging_1.logger.warn("Missing required fields: title, status");
            return (0, logging_1.createErrorResponse)(400, "Missing required fields: title, status");
        }
        const taskId = (0, uuid_1.v4)();
        const params = {
            TableName: "tasks",
            Item: {
                taskId: { S: taskId.toString() },
                title: { S: title },
                description: { S: description },
                status: { S: status },
            },
        };
        logging_1.logger.info({ taskId, message: "Creating task in DynamoDB" });
        yield dynamoDb.send(new client_dynamodb_1.PutItemCommand(params));
        logging_1.logger.info({ taskId, message: "Task created successfully" });
        return (0, logging_1.createSuccessResponse)(201, { taskId, title, description, status });
    }
    catch (error) {
        logging_1.logger.error({ error, message: "Error creating task" });
        return (0, logging_1.createErrorResponse)(500, "Internal Server Error");
    }
});
exports.handler = handler;

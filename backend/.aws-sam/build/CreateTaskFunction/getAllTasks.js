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
    logging_1.logger.info({ message: "Retrieving all tasks", event });
    try {
        const params = new lib_dynamodb_1.ScanCommand({
            TableName: "tasks",
        });
        const result = yield dynamoDb.send(params);
        const taskCount = result.Items ? result.Items.length : 0;
        logging_1.logger.info({
            message: `${taskCount} tasks retrieved successfully`,
            taskCount,
        });
        if (taskCount === 0) {
            logging_1.logger.warn({ message: "No tasks found in the database" });
        }
        return (0, logging_1.createSuccessResponse)(200, result.Items || []);
    }
    catch (error) {
        logging_1.logger.error({ error, message: "Error retrieving all tasks" });
        return (0, logging_1.createErrorResponse)(500, "Could not retrieve tasks");
    }
});
exports.handler = handler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuccessResponse = exports.createErrorResponse = exports.logger = void 0;
const pino_1 = require("pino");
exports.logger = (0, pino_1.default)({ level: "info" });
const createErrorResponse = (statusCode, message) => ({
    statusCode,
    body: JSON.stringify({ message }),
});
exports.createErrorResponse = createErrorResponse;
const createSuccessResponse = (statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
});
exports.createSuccessResponse = createSuccessResponse;

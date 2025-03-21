import pino from "pino";

export const logger = pino({ level: "info" });

export const createErrorResponse = (statusCode: number, message: string) => ({
  statusCode,
  body: JSON.stringify({ message }),
});

export const createSuccessResponse = (statusCode: number, body: object) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT, DELETE",
  },
});

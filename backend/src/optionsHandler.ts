import { APIGatewayProxyResult } from "aws-lambda";

export const handler = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers":
        "Content-Type, X-Amz-Date, Authorization, X-Api-Key",
    },
    body: JSON.stringify({ message: "CORS settings applied" }),
  };
};

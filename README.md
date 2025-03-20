## Running Locally

To run frontend locally use the command:

npm run dev

To run the backend locally use the command:

`sam local start-api`

and run DynamoDB locally with:

`docker run -d -p 8000:8000 amazon/dynamodb-local`

making sure to set DYNAMODB_ENDPOINT to http://localhost:8000 in your .env file

the API will be available locally at http://127.0.0.1:3000

eg `GET http://127.0.0.1:3000/tasks`

### Invoke Local Lambda Locally

To invoke a function locally, you can use the following command - make sure to use the function name as specified in backend/template.yaml:

`sam local invoke GetTaskFunction --event testGetEvent.json`

## Deploying the Frontend

To deploy the frontend to AWS S3, run the following command:

`aws s3 sync build/ s3://task-manager-pro-9000`

## Deploying the Backend

To manually deploy the backend, ensure you have AWS SAM CLI installed

Run `npx tsc` (or you can npm i -g typescript and run tsc) to build your dist folder first.

Authenticate either with CLI + Access Key ID & Secret Access Key, using AWS Cloudshell for direct in browser CLI, or you can use the V2 CLI and auth through a User / SSO

The user that you are authenticating with should have the IAM policy outlined in deployment/sam-deploy-policy.json

Once you are authenticated in your CLI, you can then run:

`sam build`
`sam deploy`

Use `--guided` flag on sam deploy if this is the first time deployment

## Troubleshooting

- Make sure you've installed the aws-cli and aws-sam-cli

- Ensure to build your backend files with `tsc` command and confirm that the expected function files are in the dist folder

- Use `node -v` to ensure you are using a modern nodeJS version, this app was built using node v20 but 20 or above should be fine

- If running DynamoDB locally, make sure to use the UI to populate the data

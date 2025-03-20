## Running Locally

## Deploying the Frontend

To deploy the frontend to AWS S3, run the following command:

aws s3 sync build/ s3://your-frontend-bucket-name

## Deploying the Backend

To deploy the backend, ensure you have AWS SAM CLI installed

Authenticate either with CLI + Access Key ID & Secret Access Key, using AWS Cloudshell for direct in browser CLI, or you can use the V2 CLI and auth through a User / SSO

The user that you are authenticating with should have the IAM policy outlined in deployment/sam-deploy-policy.json

Once you are authenticated in your CLI, you can then run:

sam build
sam deploy --guided

import { DynamoDBClient, type DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const GO_GAME_TABLE_NAME = process.env.GO_GAME_TABLE_NAME

const AWS_CREDENTIALS:DynamoDBClientConfig = {
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_DYNAMO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
}

const dynamoClient = new DynamoDBClient(AWS_CREDENTIALS);

export { dynamoClient, GO_GAME_TABLE_NAME }
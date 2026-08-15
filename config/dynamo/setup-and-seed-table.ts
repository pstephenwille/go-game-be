import { CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { dynamoClient, GO_GAME_TABLE_NAME } from "./dynamo";
import seedData from './seed-data.json';
import sharedSchema from "./table-schema.json";
import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

async function createTableAndSeedIt() {
    let tableExistsStatus = await checkIfTableExists();
    const tableStatus = await createTableIfNotExists(tableExistsStatus || '')
    const hasBeenSeeded = await seedTable()

    return [tableStatus, hasBeenSeeded]
}

const checkIfTableExists = async () => {
    try {
        const resp = await dynamoClient.send(new DescribeTableCommand({ TableName: GO_GAME_TABLE_NAME }));

        return resp.Table?.TableStatus
    } catch (error) {
        if (error.name !== 'ResourceNotFoundException') throw error;
        return false;
    }
}

const createTableIfNotExists = async (tableExistsStatus: string) => {
    if (tableExistsStatus === 'ACTIVE') return tableExistsStatus;

    try {
        const createTableCommand = new CreateTableCommand({
            TableName: GO_GAME_TABLE_NAME,
            ...sharedSchema,
        } as any);

        const resp = await dynamoClient.send(createTableCommand);

        return resp.TableDescription?.TableStatus;
    } catch (error) {
        throw error;
    }
};

const seedTable = async () => {
    try {
        const batchPutUsers = new BatchWriteCommand({ RequestItems: { [GO_GAME_TABLE_NAME as string]: seedData } });
        await dynamoClient.send(batchPutUsers)
        return true
    } catch (error) {
        throw error
    }
}

createTableAndSeedIt()
    .then(([tableStatus, hasBeenSeeded]) => {
        console.log('\n', `DONE: table status is ${tableStatus}, seed data is ${hasBeenSeeded}`, '\n');
        process.exit(0)
    })
    .catch((error) => {
        console.error("Top-level execution error:", error);
        process.exit(1);
    })
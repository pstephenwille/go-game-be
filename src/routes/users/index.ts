import { type FastifyPluginAsync, type FastifyRequest } from 'fastify'
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient, GO_GAME_TABLE_NAME } from '@config/dynamo/dynamo';

/* TODO: 8/6/26, stephen; create user schema
*   import zod */

interface GetUserParams {id:string}

const users: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/users/:id', async function (request:FastifyRequest<{ Params:GetUserParams }>, reply) {
    const { id } = request.params;

    const params = {
      TableName: GO_GAME_TABLE_NAME,
      Key: {
        userId: id
      }
    };


    try {
      // Send the GetCommand to DynamoDB
      const result = await dynamoClient.send(new GetCommand(params));

      // If the item does not exist, return a 404
      if (!result.Item) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return { user: result.Item };
    } catch (error) {
      console.log('%c...xxx', 'color:gold',   error);
      
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  })

  fastify.put('/users/:id', async function (_request, _reply) {
    return 'put user'
  })

  fastify.post('/users', async function (request, reply) {
    const { email } = request.body
    const userId = uuidv4();
    const timestamp = new Date().toISOString();
    const newUser = {
      email, userId,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    const params = {
      TableName: GO_GAME_TABLE_NAME,
      Item: newUser,
      ConditionExpression: 'attribute_not_exists(userId)'
    };

    try {
      await dynamoClient.send(new PutCommand(params));
      return reply.status(201).send({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.log('%c...error', 'color:gold', error);

      // Catch conditional check failures specifically
      if (error.name === 'ConditionalCheckFailedException') {
        return reply.status(409).send({ error: 'Conflict: User ID already exists' });
      }

      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal Server Error' });
    }
  })

  fastify.delete('/users/:id', async function (_request, _reply) {
    return 'delete user'
  })


}

export default users
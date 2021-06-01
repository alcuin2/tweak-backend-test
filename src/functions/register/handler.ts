import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import * as dotenv from "dotenv";

import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

import userSchema from './userSchema';

dotenv.config();

const register: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  let salt = bcrypt.genSaltSync(10);
  let passwordHash = bcrypt.hashSync(event.body.password, salt);
  
  const connection = mongoose.createConnection(process.env.MONGODB);
  const User = connection.model('User', userSchema);
  try {
      await User.create({ 
      name: event.body.name, 
      email: event.body.email, 
      password: passwordHash
    })
  }
  catch{
    return formatJSONResponse({
      statusCode: 400,
      message: "An error occurred"
    });
  }
  
  return formatJSONResponse({
    message: "User created successfully"
  })
  
}

export const main = middyfy(register);

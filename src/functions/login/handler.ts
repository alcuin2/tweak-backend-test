import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";
import userSchema from '../register/userSchema';

dotenv.config();

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let token: string;
  const connection = mongoose.createConnection(process.env.MONGODB);
  const User = connection.model('User', userSchema);
  const user = await User.findOne({ email: event.body.email})
  if (user == null){
    return formatJSONResponse({
      statusCode: 400,
      message: `No user with email ${event.body.email}`,
    })
  }

  if (bcrypt.compareSync(event.body.password, user.password)){
    token = jwt.sign({email: user.email}, process.env.JWTSECRET);
  }
  else {
    return formatJSONResponse({
      statusCode: 400,
      message: "Login failed.",
    })
  }
  
  return formatJSONResponse({
    message: "Login successful",
    token
  });
}

export const main = middyfy(login);

import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as fileType from 'file-type';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';
import * as magick from "imagemagick";

dotenv.config();

const s3 = new AWS.S3();

const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];


const uploadImage: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  if(!event.headers.token){
    return formatJSONResponse({
      statusCode: 400,
      message: "Token required in header"
    })
  }

  const token = event.headers.token;

  try {
    jwt.verify(token, process.env.JWTSECRET);
  } catch(err) {
    return formatJSONResponse({
      statusCode: 400,
      message: "Incorrect token"
    })
  }

  let imageData = event.body.file;
  if (event.body.file.substr(0, 7) === 'base64,') {
      imageData = event.body.file.substr(7, event.body.file.length);
  }

  if (!allowedMimes.includes(event.body.mime)) {
    return formatJSONResponse({
      statusCode: 400,
      message: "mime type not allowed"
    })
  }

  const buffer = Buffer.from(imageData, 'base64');
  const fileInfo = await fileType.fromBuffer(buffer);
  const detectedExt = fileInfo.ext;
  const detectedMime = fileInfo.mime;

  // console.log(detectedMime)

  if (detectedMime !== event.body.mime) {
    return formatJSONResponse({
      statusCode: 400,
      message: "mime types don't match"
    })
  }

  const name = uuid();
  const key = `${name}.${detectedExt}`;

  /*
  magick.readMetadata(buffer, (err, meta) => {
    if (err) {
      console.log("error on metadata")
    }
    console.log(meta)
  })
  */

  await s3.putObject({
              Body: buffer,
              Key: key,
              ContentType: event.body.mime,
              Bucket: process.env.S3BUCKET,
              ACL: 'public-read',
          }).promise();


  return formatJSONResponse({
    message: "Image uploaded",
  });
}

export const main = middyfy(uploadImage);

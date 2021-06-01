import type { AWS } from '@serverless/typescript';
import * as dotenv from "dotenv";

import register from '@functions/register';
import login from '@functions/login';
import uploadImage from '@functions/uploadImage';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'tweak-test',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    localstack: {
      stages: ['local']
    },
    s3: {
      properties: {
        bucketName: process.env.S3BUCKET,
        accessControl: 'public-read'
      }
    }
  },
  plugins: ['serverless-webpack', 'serverless-offline', 'serverless-localstack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { register, login, uploadImage },
};

module.exports = serverlessConfiguration;

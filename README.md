**Dependencies**
- `serverless-offline`
- `localstack`
- `aws-cli`

**Setup**

* Create a `.env` file at root folder and enter your `MONGODB` url, `JWTSECRET` and `S3BUCKET`. see `.env.sample`

* Create your `S3BUCKET` in `localstack` using 
```
aws --endpoint-url=http://localhost:4566 s3 mb s3://<s3bucket>
```

* Install all dependencies. Run
```
npm install
```

* Run app with `serverless-offline` and `localstack`
```
sls offline --stage local
```

* Run `localstack`
```
localstack start
```
**Endpoints**

* `/local/register` - method `POST`

Sample request
```
{
    "name": <name>,
    "email": <email>,
    "password": <password>

}
```

* `/local/login` - method `POST`

This endpoint returns a `jwt` token.

Sample request
```
{
    "email": <email>,
    "password": <password>
}
```

* `/local/uploadImage` - method `POST`.

Image files must be converted to `base64` string and paseed to this endpoint. To convert image to base64 see https://base64.guru/converter/encode/file

This endpoint also requires `mime` parameter, which should be either `image/jpg`, `image/png` or `image/jpeg`

Sample request 
```
{
    "mime": <mimetype>,
    "file": <base64>
}
```

Remember to pass `jwt` token in the the `request` header with name `token`.

**Addtional**

You can check if the file is uploaded to `s3` using 
```
aws --endpoint-url=http://localhost:4566 s3 ls s3://<s3bucket>
```

**Omissions**

Because of time constraints, I couldn't write the `unit/integration` tests. Also, `imagemagick` library for `node` is having some `errors` when attempting to read `metadata`.

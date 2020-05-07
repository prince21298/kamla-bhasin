const Dotenv = require('dotenv');

Dotenv.config({ path: `${__dirname}/../.env` });

module.exports = {
  valueX: 'x',
  valueY: 2,
  users: {
    jwt: {
      secret: process.env.JWT_SIGNING_SECRET,
      expiresIn: '7d',
    },
    auth: {
      googleClientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    },
  },
  aws: {
    s3: {
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
      defaultBucket: process.env.S3_BUCKET,
      defaultBucketBaseURL: process.env.S3_BUCKET_BASE_URL + process.env.S3_BUCKET,
      apiVersion: '2006-03-01',
    },
  },
};

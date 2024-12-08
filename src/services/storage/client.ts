import { S3Client } from "@aws-sdk/client-s3";
import { StorageConfig } from './config';

export const createS3Client = (config: StorageConfig): S3Client => {
  const endpoint = `${config.useSSL ? 'https' : 'http'}://${config.endpoint}${config.port ? `:${config.port}` : ''}`;
  
  return new S3Client({
    endpoint,
    credentials: {
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey
    },
    forcePathStyle: true,
    region: config.region,
    maxAttempts: 3
  });
};
import { 
  CreateBucketCommand, 
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { StorageError } from './types';

export const ensureBucketExists = async (
  client: S3Client,
  bucket: string,
  region: string
): Promise<void> => {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return;
  } catch (error) {
    const err = error as StorageError;
    if (err.$metadata?.httpStatusCode !== 404) {
      throw error;
    }
  }

  // Create bucket if it doesn't exist
  await client.send(new CreateBucketCommand({
    Bucket: bucket,
    CreateBucketConfiguration: {
      LocationConstraint: region
    }
  }));

  // Set bucket policy for public read access
  const policy = {
    Version: '2012-10-17',
    Statement: [{
      Sid: 'PublicRead',
      Effect: 'Allow',
      Principal: '*',
      Action: ['s3:GetObject'],
      Resource: [`arn:aws:s3:::${bucket}/*`]
    }]
  };

  await client.send(new PutBucketPolicyCommand({
    Bucket: bucket,
    Policy: JSON.stringify(policy)
  }));
};
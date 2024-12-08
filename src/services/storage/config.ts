import { z } from 'zod';

export const storageConfigSchema = z.object({
  endpoint: z.string(),
  accessKey: z.string(),
  secretKey: z.string(),
  bucket: z.string(),
  useSSL: z.boolean(),
  region: z.string().default('us-east-1'),
  port: z.number().optional(),
  consoleEndpoint: z.string().optional(),
  consolePort: z.number().optional()
});

export type StorageConfig = z.infer<typeof storageConfigSchema>;

export const validateStorageConfig = (config: unknown): StorageConfig => {
  return storageConfigSchema.parse(config);
};
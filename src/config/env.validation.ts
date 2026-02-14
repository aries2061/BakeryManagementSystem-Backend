import { BadRequestException } from '@nestjs/common';

const requiredKeys = [
  'MONGODB_URI',
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'JWT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'FRONTEND_URL',
] as const;

type RequiredKey = (typeof requiredKeys)[number];

export type AppEnv = Record<RequiredKey, string> & {
  PORT?: string;
  FRONTEND_ORIGINS?: string;
  NODE_ENV?: string;
};

export function validateEnv(config: Record<string, unknown>): AppEnv {
  const missing = requiredKeys.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new BadRequestException(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  return config as AppEnv;
}

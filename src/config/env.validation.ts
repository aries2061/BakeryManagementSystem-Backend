import { BadRequestException } from '@nestjs/common';

const requiredKeys = [
  'SUPABASE_URL',
  'SUPABASE_KEY',
  'JWT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
] as const;

type RequiredKey = (typeof requiredKeys)[number];

export type AppEnv = Record<RequiredKey, string> & {
  MONGODB_URI?: string;
  ENABLE_MONGODB_LOGGING?: string;
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

  const enableMongoLogging = config.ENABLE_MONGODB_LOGGING === 'true';
  const mongoUri = config.MONGODB_URI;
  const hasMongoUri = typeof mongoUri === 'string' && mongoUri.trim().length > 0;

  if (enableMongoLogging && !hasMongoUri) {
    throw new BadRequestException(
      'Missing required environment variables: MONGODB_URI (ENABLE_MONGODB_LOGGING=true)',
    );
  }

  const frontendUrl = config.FRONTEND_URL;
  const frontendOrigins = config.FRONTEND_ORIGINS;
  const hasFrontendUrl =
    typeof frontendUrl === 'string' && frontendUrl.trim().length > 0;
  const hasFrontendOrigins =
    typeof frontendOrigins === 'string' && frontendOrigins.trim().length > 0;

  if (!hasFrontendUrl && !hasFrontendOrigins) {
    throw new BadRequestException(
      'Missing required environment variables: FRONTEND_URL or FRONTEND_ORIGINS',
    );
  }

  return config as AppEnv;
}

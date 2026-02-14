import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

type SupabaseLikeError = {
  code?: string;
  message?: string;
  details?: string;
};

export function mapSupabaseError(
  error: SupabaseLikeError,
  context: string,
): never {
  const message = error.message || 'Unknown database error';

  if (error.code === 'PGRST116') {
    throw new NotFoundException(`${context} not found`);
  }

  if (error.code === '23505') {
    throw new ConflictException(`${context} already exists`);
  }

  if (error.code?.startsWith('22') || error.code?.startsWith('23')) {
    throw new BadRequestException(`${context} failed: ${message}`);
  }

  throw new InternalServerErrorException(`${context} failed: ${message}`);
}

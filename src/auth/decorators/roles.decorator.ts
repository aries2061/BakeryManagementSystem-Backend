import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/users.service';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

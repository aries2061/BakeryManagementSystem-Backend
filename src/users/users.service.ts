import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { mapSupabaseError } from '../database/supabase-error.util';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  branch_id?: string;
  provider?: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is JSON object not found (no rows)
      this.logger.error(`Error finding user by email: ${error.message}`);
      mapSupabaseError(error, 'Find user by email');
    }

    return data as User;
  }

  async create(user: User): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([user])
      .select()
      .single();

    if (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      mapSupabaseError(error, 'Create user');
    }

    return data as User;
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      mapSupabaseError(error, 'Find user by id');
    }
    return data as User;
  }
}

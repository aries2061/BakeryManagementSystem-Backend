import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { mapSupabaseError } from '../database/supabase-error.util';

export interface Branch {
  id?: string;
  name: string;
  address: string;
  phone: string;
  manager_id?: string;
}

@Injectable()
export class BranchesService {
  private readonly logger = new Logger(BranchesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async create(branch: Branch): Promise<Branch> {
    const { data, error } = await this.supabase
      .from('branches')
      .insert([branch])
      .select()
      .single();

    if (error) {
      this.logger.error(`Error creating branch: ${error.message}`);
      mapSupabaseError(error, 'Create branch');
    }
    return data as Branch;
  }

  async findAll(): Promise<Branch[]> {
    const { data, error } = await this.supabase.from('branches').select('*');

    if (error) {
      this.logger.error(`Error fetching branches: ${error.message}`);
      mapSupabaseError(error, 'Fetch branches');
    }
    return data as Branch[];
  }

  async findOne(id: string): Promise<Branch | null> {
    const { data, error } = await this.supabase
      .from('branches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      mapSupabaseError(error, 'Fetch branch');
    }
    return data as Branch;
  }

  async update(id: string, branch: Partial<Branch>): Promise<Branch> {
    const { data, error } = await this.supabase
      .from('branches')
      .update(branch)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Error updating branch: ${error.message}`);
      mapSupabaseError(error, 'Update branch');
    }
    return data as Branch;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('branches')
      .delete()
      .eq('id', id);

    if (error) {
      mapSupabaseError(error, 'Delete branch');
    }
  }
}

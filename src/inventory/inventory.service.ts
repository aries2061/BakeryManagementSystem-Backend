import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { mapSupabaseError } from '../database/supabase-error.util';

export enum ItemType {
  INGREDIENT = 'INGREDIENT',
  PRODUCT = 'PRODUCT',
}

export interface InventoryItem {
  id?: string;
  name: string;
  type: ItemType;
  quantity: number;
  unit: string;
  price?: number;
  expiry_date?: string;
  branch_id: string;
  low_stock_threshold?: number;
  vendor?: string;
}

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  async create(item: InventoryItem): Promise<InventoryItem> {
    const { data, error } = await this.supabase
      .from('inventory')
      .insert([item])
      .select()
      .single();

    if (error) {
      this.logger.error(`Error creating inventory item: ${error.message}`);
      mapSupabaseError(error, 'Create inventory item');
    }
    return data as InventoryItem;
  }

  async findAll(branchId?: string): Promise<InventoryItem[]> {
    let query = this.supabase.from('inventory').select('*');

    if (branchId) {
      query = query.eq('branch_id', branchId);
    }

    const { data, error } = await query;

    if (error) {
      this.logger.error(`Error fetching inventory: ${error.message}`);
      mapSupabaseError(error, 'Fetch inventory');
    }
    return data as InventoryItem[];
  }

  async findOne(id: string): Promise<InventoryItem | null> {
    const { data, error } = await this.supabase
      .from('inventory')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      mapSupabaseError(error, 'Fetch inventory item');
    }
    return data as InventoryItem;
  }

  async update(
    id: string,
    item: Partial<InventoryItem>,
  ): Promise<InventoryItem> {
    const { data, error } = await this.supabase
      .from('inventory')
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.logger.error(`Error updating inventory item: ${error.message}`);
      mapSupabaseError(error, 'Update inventory item');
    }
    return data as InventoryItem;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      mapSupabaseError(error, 'Delete inventory item');
    }
  }
}

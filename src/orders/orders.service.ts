import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { mapSupabaseError } from '../database/supabase-error.util';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  item_id: string;
  name: string;
  quantity: number;
  price: number;
}

interface InventoryRow {
  id: string;
  quantity: number;
  branch_id: string;
}

export interface Order {
  id?: string;
  customer_id?: string;
  branch_id: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  created_at?: string;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.getClient();
  }

  private calculateLoyaltyPoints(totalAmount: number): number {
    return Math.max(0, Math.floor(totalAmount / 100));
  }

  private async restoreStockLevels(
    previousQuantities: Map<string, number>,
  ): Promise<void> {
    for (const [inventoryId, quantity] of previousQuantities.entries()) {
      const { error } = await this.supabase
        .from('inventory')
        .update({ quantity })
        .eq('id', inventoryId)
        .select('id')
        .single();

      if (error) {
        this.logger.error(
          `Failed to restore stock for ${inventoryId}: ${error.message}`,
        );
      }
    }
  }

  async create(order: Order): Promise<Order> {
    const itemIds = order.items.map((item) => item.item_id);
    const uniqueItemIds = [...new Set(itemIds)];

    const { data: inventoryRows, error: inventoryError } = await this.supabase
      .from('inventory')
      .select('id, quantity, branch_id')
      .in('id', uniqueItemIds)
      .eq('branch_id', order.branch_id);

    if (inventoryError) {
      this.logger.error(`Error checking inventory: ${inventoryError.message}`);
      mapSupabaseError(inventoryError, 'Validate order stock');
    }

    const inventoryMap = new Map(
      (inventoryRows as InventoryRow[]).map((row) => [row.id, row]),
    );
    const previousQuantities = new Map<string, number>();

    for (const item of order.items) {
      const stockItem = inventoryMap.get(item.item_id);

      if (!stockItem) {
        throw new BadRequestException(
          `Inventory item not found: ${item.item_id}`,
        );
      }

      if (stockItem.quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for item ${item.item_id}. Available: ${stockItem.quantity}, requested: ${item.quantity}`,
        );
      }

      const newQuantity = stockItem.quantity - item.quantity;
      previousQuantities.set(item.item_id, stockItem.quantity);

      const { error: stockUpdateError } = await this.supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', item.item_id)
        .eq('branch_id', order.branch_id)
        .select('id')
        .single();

      if (stockUpdateError) {
        this.logger.error(
          `Error updating stock for ${item.item_id}: ${stockUpdateError.message}`,
        );
        await this.restoreStockLevels(previousQuantities);
        mapSupabaseError(stockUpdateError, 'Deduct inventory stock');
      }
    }

    const { data, error } = await this.supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) {
      this.logger.error(`Error creating order: ${error.message}`);
      await this.restoreStockLevels(previousQuantities);
      mapSupabaseError(error, 'Create order');
    }

    if (order.customer_id) {
      const { data: customer, error: customerError } = await this.supabase
        .from('customers')
        .select('loyalty_points')
        .eq('id', order.customer_id)
        .single();

      if (customerError) {
        await this.supabase
          .from('orders')
          .delete()
          .eq('id', (data as Order).id);
        await this.restoreStockLevels(previousQuantities);
        mapSupabaseError(customerError, 'Fetch customer for loyalty update');
      }

      const currentPoints = Number(
        (customer as { loyalty_points?: number }).loyalty_points || 0,
      );
      const pointsToAdd = this.calculateLoyaltyPoints(order.total_amount);
      const loyaltyPoints = currentPoints + pointsToAdd;

      let tier = 'BRONZE';
      if (loyaltyPoints >= 1000) {
        tier = 'GOLD';
      } else if (loyaltyPoints >= 500) {
        tier = 'SILVER';
      }

      const { error: loyaltyError } = await this.supabase
        .from('customers')
        .update({ loyalty_points: loyaltyPoints, tier })
        .eq('id', order.customer_id)
        .select('id')
        .single();

      if (loyaltyError) {
        await this.supabase
          .from('orders')
          .delete()
          .eq('id', (data as Order).id);
        await this.restoreStockLevels(previousQuantities);
        mapSupabaseError(loyaltyError, 'Update customer loyalty points');
      }
    }

    return data as Order;
  }

  async findAll(branchId?: string): Promise<Order[]> {
    let query = this.supabase.from('orders').select('*');
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    const { data, error } = await query;
    if (error) {
      this.logger.error(`Error fetching orders: ${error.message}`);
      mapSupabaseError(error, 'Fetch orders');
    }
    return data as Order[];
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      mapSupabaseError(error, 'Update order status');
    }
    return data as Order;
  }
}

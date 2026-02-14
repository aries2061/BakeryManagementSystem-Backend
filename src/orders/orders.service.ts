import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

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

    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async create(order: Order): Promise<Order> {
        // 1. TODO: Validate Stock (should inject InventoryService or check directly)
        // 2. TODO: Deduct Stock
        // 3. Create Order
        const { data, error } = await this.supabase
            .from('orders')
            .insert([order])
            .select()
            .single();

        if (error) {
            this.logger.error(`Error creating order: ${error.message}`);
            throw error;
        }

        // 4. TODO: Update Loyalty Points

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
            return [];
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

        if (error) throw error;
        return data as Order;
    }
}

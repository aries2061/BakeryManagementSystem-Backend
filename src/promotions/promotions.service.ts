import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreatePromotionDto, UpdatePromotionDto, DiscountType } from './dto/create-promotion.dto';

export interface Promotion {
    id?: string;
    name: string;
    description?: string;
    discount_type: DiscountType;
    discount_value: number;
    start_date: string;
    end_date: string;
    branch_id?: string;
    product_id?: string;
    min_order_amount?: number;
}

@Injectable()
export class PromotionsService {
    private readonly logger = new Logger(PromotionsService.name);

    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
        const { data, error } = await this.supabase
            .from('promotions')
            .insert([createPromotionDto])
            .select()
            .single();

        if (error) {
            this.logger.error(`Error creating promotion: ${error.message}`);
            throw error;
        }
        return data as Promotion;
    }

    async findAll(branchId?: string): Promise<Promotion[]> {
        let query = this.supabase.from('promotions').select('*');
        // Implement logic to filter by branch (either null branch_id (global) or matching branch_id)
        if (branchId) {
            query = query.or(`branch_id.eq.${branchId},branch_id.is.null`);
        }

        const { data, error } = await query;

        if (error) {
            this.logger.error(`Error fetching promotions: ${error.message}`);
            return [];
        }
        return data as Promotion[];
    }

    async findOne(id: string): Promise<Promotion | null> {
        const { data, error } = await this.supabase
            .from('promotions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Promotion;
    }

    async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
        const { data, error } = await this.supabase
            .from('promotions')
            .update(updatePromotionDto)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Promotion;
    }

    async remove(id: string): Promise<void> {
        const { error } = await this.supabase
            .from('promotions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
}

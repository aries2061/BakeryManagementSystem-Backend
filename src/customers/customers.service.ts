import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/create-customer.dto';

export enum LoyaltyTier {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
}

export interface Customer {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    loyalty_points: number;
    tier: LoyaltyTier;
    preferences?: any;
}

@Injectable()
export class CustomersService {
    private readonly logger = new Logger(CustomersService.name);

    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const customer: Customer = {
            ...createCustomerDto,
            loyalty_points: 0,
            tier: LoyaltyTier.BRONZE,
        };

        const { data, error } = await this.supabase
            .from('customers')
            .insert([customer])
            .select()
            .single();

        if (error) {
            this.logger.error(`Error creating customer: ${error.message}`);
            throw error;
        }
        return data as Customer;
    }

    async findAll(): Promise<Customer[]> {
        const { data, error } = await this.supabase
            .from('customers')
            .select('*');

        if (error) {
            this.logger.error(`Error fetching customers: ${error.message}`);
            return [];
        }
        return data as Customer[];
    }

    async findOne(id: string): Promise<Customer | null> {
        const { data, error } = await this.supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as Customer;
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
        // Calculate Tier if points changed (Logic could be moved to separate method/service)
        let tier = LoyaltyTier.BRONZE;
        if (updateCustomerDto.loyalty_points) {
            if (updateCustomerDto.loyalty_points >= 1000) tier = LoyaltyTier.GOLD;
            else if (updateCustomerDto.loyalty_points >= 500) tier = LoyaltyTier.SILVER;
        }

        const updateData = { ...updateCustomerDto };
        if (updateCustomerDto.loyalty_points) {
            updateData['tier'] = tier;
        }

        const { data, error } = await this.supabase
            .from('customers')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Customer;
    }
}

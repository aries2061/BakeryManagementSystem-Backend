import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/create-employee.dto';

export interface Employee {
    id?: string;
    user_id: string;
    branch_id: string;
    hourly_rate: number;
    schedule?: any;
    hired_date?: string;
}

@Injectable()
export class EmployeesService {
    private readonly logger = new Logger(EmployeesService.name);

    constructor(private readonly supabaseService: SupabaseService) { }

    private get supabase() {
        return this.supabaseService.getClient();
    }

    async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const { data, error } = await this.supabase
            .from('employees')
            .insert([createEmployeeDto])
            .select()
            .single();

        if (error) {
            this.logger.error(`Error creating employee: ${error.message}`);
            throw error;
        }
        return data as Employee;
    }

    async findAll(branchId?: string): Promise<Employee[]> {
        let query = this.supabase.from('employees').select('*, users!inner(name, email, role)');

        if (branchId) {
            query = query.eq('branch_id', branchId);
        }

        const { data, error } = await query;

        if (error) {
            this.logger.error(`Error fetching employees: ${error.message}`);
            return [];
        }
        return data as any[]; // data will have joined user info
    }

    async findOne(id: string): Promise<Employee | null> {
        const { data, error } = await this.supabase
            .from('employees')
            .select('*, users!inner(name, email, role)')
            .eq('id', id)
            .single();

        if (error) return null;
        return data as any;
    }

    async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
        const { data, error } = await this.supabase
            .from('employees')
            .update(updateEmployeeDto)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Employee;
    }
}

import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './dto/create-employee.dto';
import { JsonObject } from '../common/types/json-value.type';
import { mapSupabaseError } from '../database/supabase-error.util';

export interface Employee {
  id?: string;
  user_id: string;
  branch_id: string;
  hourly_rate: number;
  schedule?: JsonObject;
  hired_date?: string;
}

export interface EmployeeWithUser extends Employee {
  users: {
    name: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class EmployeesService {
  private readonly logger = new Logger(EmployeesService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

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
      mapSupabaseError(error, 'Create employee');
    }
    return data as Employee;
  }

  async findAll(branchId?: string): Promise<EmployeeWithUser[]> {
    let query = this.supabase
      .from('employees')
      .select('*, users!inner(name, email, role)');

    if (branchId) {
      query = query.eq('branch_id', branchId);
    }

    const { data, error } = await query;

    if (error) {
      this.logger.error(`Error fetching employees: ${error.message}`);
      mapSupabaseError(error, 'Fetch employees');
    }
    return data as EmployeeWithUser[];
  }

  async findOne(id: string): Promise<EmployeeWithUser | null> {
    const { data, error } = await this.supabase
      .from('employees')
      .select('*, users!inner(name, email, role)')
      .eq('id', id)
      .single();

    if (error) {
      mapSupabaseError(error, 'Fetch employee');
    }
    return data as EmployeeWithUser;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const { data, error } = await this.supabase
      .from('employees')
      .update(updateEmployeeDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      mapSupabaseError(error, 'Update employee');
    }
    return data as Employee;
  }
}

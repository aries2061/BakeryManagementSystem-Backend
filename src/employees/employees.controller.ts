import { Controller, Get, Post, Body, Param, Put, UseGuards, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/users.service';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    create(@Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeesService.create(createEmployeeDto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    findAll(@Query('branch_id') branchId?: string) {
        return this.employeesService.findAll(branchId);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    findOne(@Param('id') id: string) {
        return this.employeesService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeesService.update(id, updateEmployeeDto);
    }
}

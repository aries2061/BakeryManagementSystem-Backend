import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/create-branch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/users.service';

@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchesController {
    constructor(private readonly branchesService: BranchesService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() branch: CreateBranchDto) {
        return this.branchesService.create(branch as any);
    }

    @Get()
    // Accessible by all authenticated users (or maybe restricted?)
    findAll() {
        return this.branchesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.branchesService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    update(@Param('id') id: string, @Body() branch: UpdateBranchDto) {
        return this.branchesService.update(id, branch);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.branchesService.remove(id);
    }
}

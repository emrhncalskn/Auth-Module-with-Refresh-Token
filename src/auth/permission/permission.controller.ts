import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { PermissionDto } from '../dto/permission.dto';

@ApiBearerAuth()
@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Get()
    async getPermissions(@Res() res) {
        try { return res.status(200).send(await this.permissionService.getPermissions(res)) }
        catch (error) { return res.status(400).send({ msg: error.message }) }
    }

    @Post('get/:id')
    async getPermissionById(@Res() res, @Param('id') id: number) {
        return await this.permissionService.getPermission(id, res);
    }

    @Post('create/new')
    async create(@Body() data: PermissionDto, @Res() res) {
        return await this.permissionService.create(data, res);
    }

    @Post('set/:id')
    async setPermission(@Param('id') id: number, @Body() data: PermissionDto, @Res() res) {
        try { return res.status(200).send(await this.permissionService.setPermission(id, data)) }
        catch (error) { return res.status(400).send({ msg: error.message }) }
    }

    @Post('delete/:id')
    async deletePermission(@Param('id') id: number, @Res() res) {
        try { return res.status(200).send(await this.permissionService.deletePermission(id, res)) }
        catch (error) { return res.status(400).send({ msg: error.message }) }
    }

    @Post('create/role')
    async createRole(@Body() data: RoleDto, @Res() res) {
        return await this.permissionService.createRole(data, res);
    }

    @Get('roles')
    async getRoles(@Res() res) {
        return await this.permissionService.getRoles(res);
    }

    @Get('role/get/:id')
    async getRoleById(@Param('id') id: number, @Res() res) {
        return await this.permissionService.getRole(id, res);
    }

    @Post('role/set/:id')
    async setRole(@Param('id') id: number, @Body() data: RoleDto, @Res() res) {
        return await this.permissionService.setRole(id, data.name, res);
    }

    @Post('role/del/:id')
    async deleteRole(@Param('id') id: number, @Res() res) {
        return await this.permissionService.deleteRole(id, res);
    }

    @Get('functions')
    async getApis(@Res() res) {
        return await this.permissionService.getApis(res);
    }

    @Get('functions/:roleid')
    async getApisByRole(@Param('roleid') roleid: number, @Res() res) {
        return await this.permissionService.getApisByRole(roleid, res);
    }

}

import { ApiProperty } from "@nestjs/swagger";

export class PermissionDto {
    @ApiProperty()
    role_id: number;
    @ApiProperty()
    api_id: number;
}

export class ApiDto {
    @ApiProperty()
    description: string;
}
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    status: number;
}

export class UpdateUserDto {
    @ApiProperty()
    email?: string;
    @ApiProperty()
    password?: string;
    status?: number;
    refresh_token?: string;
}

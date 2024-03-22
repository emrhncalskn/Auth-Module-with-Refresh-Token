import { JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";

const expireTime = '30s';
const refreshTokenExpireTime = '12d';

export const jwtModuleOptions: JwtModuleOptions = { secret: process.env.JWT_SECRET, signOptions: { expiresIn: expireTime, algorithm: 'HS256' } };
export const jwtSignOptions: JwtSignOptions = { secret: process.env.JWT_SECRET, expiresIn: expireTime };
export const jwtRefreshSignOptions: JwtSignOptions = { secret: process.env.JWT_REFRESH_SECRET, expiresIn: refreshTokenExpireTime };

import { SetMetadata } from '@nestjs/common';

export const IS_ALLOWED_AUTH = 'passAuth';
export const PassAuth = () => SetMetadata(IS_ALLOWED_AUTH, true);
import { SetMetadata } from '@nestjs/common';

export const IS_ALLOWED = 'isAllowed';
export const PassAuth = () => SetMetadata(IS_ALLOWED, true);
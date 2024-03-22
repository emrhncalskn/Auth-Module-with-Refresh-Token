import { SetMetadata } from '@nestjs/common';

export const IS_ALLOWED_PERMISSION = 'passPermission';
export const PassPermission = () => SetMetadata(IS_ALLOWED_PERMISSION, true);
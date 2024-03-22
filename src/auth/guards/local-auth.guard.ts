import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// önce buraya sonra strategy'e girer

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }
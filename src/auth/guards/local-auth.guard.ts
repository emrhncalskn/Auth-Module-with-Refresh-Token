import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Kullanıcı var mı yok mu ve girdiği bilgiler doğru mu diye kontrol eden guard -- login yapacak kullanıcıyı kontrol eder

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { } // önce buraya sonra strategy'e girer
export class ErrorMessage {

    static Auth() {
        return {
            ALREADY_REGISTERED: 'Email is already registered. Please login.',
            WRONG_PASSWORD: 'Wrong password!',
            USER_NOT_FOUND: 'User not found!',
            REGISTER_SUCCESS: 'User has been registered successfully',
            REGISTER_FAIL: 'User could not be registered'
        }
    }

    static Permission() {
        return {
            ROUTE_NOT_EXIST: 'This route is not exist',
            METHOD_NOT_EXIST: 'This method is not exist',
            API_NOT_EXIST: 'This Api is not exist',
            USER_NOT_EXIST: 'This user is not exist',
            PERMISSION_NOT_EXIST: "You don't have permission to access",
            NOT_FOUND: 'Yetki bulunamadı',
            NOT_CREATED: 'Yetki oluşturulamadı',
            NOT_UPDATED: 'Yetki güncellenemedi',
            NOT_DELETED: 'Yetki silinemedi',
            DENIED: 'Yetki reddedildi',
            ALREADY_EXIST: 'Yetki zaten mevcut',
        }
    }

    static Api() {
        return {
            NO_PERMISSION: 'Bu fonksiyonu kullanmaya yetkiniz yok!',
        }
    }

    static Role() {
        return {
            NOT_FOUND: 'Rol bulunamadı',
            NOT_CREATED: 'Rol oluşturulamadı',
            NOT_UPDATED: 'Rol güncellenemedi',
            NOT_DELETED: 'Rol silinemedi',
            HAS_PERMISSION: 'Bu role ait yetkiler var',
            CANT_BE_CHANGE: 'Bu rol değiştirilemez!',
            ALREADY_EXIST: 'Bu rol zaten mevcut',
        }
    }
}
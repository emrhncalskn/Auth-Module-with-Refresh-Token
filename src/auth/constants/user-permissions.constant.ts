export class UserPermissionsConstant {
    static PERMISSIONS =
        [
            { path: '/', method: 'get' },
            { path: '/test', method: 'get' },
        ]
}

// Bu constant içerisinde kullanıcı rolüne verilecek izinler tanımlanır.
// Buraya eklenen izinler, kullanıcı rolüne default olarak atanır.
// Uygulama bir kere çalıştıktan sonra buradan silinen izinler silinmez, veritabanından silinmesi gerekmektedir.
// Burası haricinde /permission apileri üzerinden izinler yönetilebilir. 
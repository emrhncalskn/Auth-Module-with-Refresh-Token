export class AuthErrorMessage {
    static ALREADY_REGISTERED = 'Email is already registered. Please login.';
    static WRONG_PASSWORD = 'Wrong password!';
    static USER_NOT_FOUND = 'User not found!';
    static REGISTER_SUCCESS = 'User has been registered successfully';
    static REGISTER_FAIL = 'User could not be registered';
}

export class PermissionErrorMessage {
    static ROUTE_NOT_EXIST = 'This route is not exist';
    static METHOD_NOT_EXIST = 'This method is not exist';
    static API_NOT_EXIST = 'This Api is not exist';
    static USER_NOT_EXIST = 'This user is not exist';
    static PERMISSION_NOT_EXIST = "You don't have permission to access";
}
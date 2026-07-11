export interface RegisterUserData {
    name: string,
    email: string,
    password: string
}

export interface LoginUserData {
    email: string,
    password: string
}

export interface CreateRefreshToken {
    userId: string,
    token: string,
    expiresAt: Date
}

export interface ChangePasswordData {
    currentPassword: string
    newPassword: string
}

export interface RefreshTokenData {
    refreshToken: string;
}
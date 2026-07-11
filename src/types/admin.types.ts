export interface updateUserStatusData {
    status: 'ACTIVE' | 'BLOCKED'
}

export interface updateUserdata {
    name?: string
    email?: string
    role?: "ADMIN" | "USER"
}

export interface CreateUserData {
    name: string
    email: string
    password: string
    role: "ADMIN" | "USER"
}

export interface IParams {
    userId: string
}
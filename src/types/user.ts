import { User } from "@prisma/client"

export type T_UserWithoutPassword = Omit<User, 'password'>

export type T_UserResponse = { user: T_UserWithoutPassword, token: string }
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

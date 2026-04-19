import { UserRole } from './user.entity';

export interface UserData {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  username: string;
  password: string;
  role: UserRole;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<UserData>;
  findByUsername(username: string): Promise<UserData | null>;
  findById(id: string): Promise<UserData | null>;
  existsByUsername(username: string): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');

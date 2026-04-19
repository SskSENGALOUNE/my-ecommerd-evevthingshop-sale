import { UserRole } from '../../../domain/user/user.entity';

export class RegisterCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly role: UserRole = UserRole.USER,
  ) {}
}

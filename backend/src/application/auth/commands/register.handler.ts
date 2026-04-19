import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterCommand } from './register.command';
import { type IUserRepository, USER_REPOSITORY, UserData } from '../../../domain/user/user.repository';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, UserData> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) { }

  async execute(command: RegisterCommand): Promise<UserData> {
    const exists = await this.userRepository.existsByUsername(command.username);
    if (exists) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(command.password, 10);

    return this.userRepository.create({
      username: command.username,
      password: hashedPassword,
      role: command.role,
    });
  }
}

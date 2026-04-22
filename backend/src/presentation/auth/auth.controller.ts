import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CustomerLoginDto } from './dto/customer-login.dto';
import { CustomerRegisterDto } from './dto/customer-register.dto';
import { AdminLoginCommand } from '../../application/auth/commands/admin-login.command';
import { CustomerLoginCommand } from '../../application/auth/commands/customer-login.command';
import { CustomerRegisterCommand } from '../../application/auth/commands/customer-register.command';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  async adminLogin(@Body() dto: AdminLoginDto) {
    return this.commandBus.execute(new AdminLoginCommand(dto.email, dto.password));
  }

  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customer login' })
  async customerLogin(@Body() dto: CustomerLoginDto) {
    return this.commandBus.execute(new CustomerLoginCommand(dto.email, dto.password));
  }

  @Post('customer/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Customer register' })
  async customerRegister(@Body() dto: CustomerRegisterDto) {
    return this.commandBus.execute(new CustomerRegisterCommand(dto.email, dto.password, dto.name, dto.phone));
  }
}

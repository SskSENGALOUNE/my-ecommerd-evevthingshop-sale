import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';
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
  async adminLogin(@Body() dto: AdminLoginDto, @Res() res: Response) {
    const result = await this.commandBus.execute(new AdminLoginCommand(dto.email, dto.password));

    // ກຳນົດ httpOnly cookie (7 days)
    res.cookie('admin_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        admin: result.admin,
      },
    });
  }

  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Customer login' })
  async customerLogin(@Body() dto: CustomerLoginDto, @Res() res: Response) {
    const result = await this.commandBus.execute(new CustomerLoginCommand(dto.email, dto.password));

    // ກຳນົດ httpOnly cookie (7 days)
    res.cookie('customer_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        customer: result.customer,
      },
    });
  }

  @Post('customer/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Customer register' })
  async customerRegister(@Body() dto: CustomerRegisterDto, @Res() res: Response) {
    const result = await this.commandBus.execute(new CustomerRegisterCommand(dto.email, dto.password, dto.name, dto.phone));

    // ກຳນົດ httpOnly cookie (7 days)
    res.cookie('customer_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return res.json({
      success: true,
      data: {
        accessToken: result.accessToken,
        customer: result.customer,
      },
    });
  }
}

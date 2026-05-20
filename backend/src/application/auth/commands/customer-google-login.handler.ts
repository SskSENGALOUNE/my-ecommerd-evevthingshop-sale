import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { CustomerGoogleLoginCommand } from "./customer-google-login.command";
import {
  CUSTOMER_REPOSITORY,
  type ICustomerRepository,
} from "../../../domain/customer/customer.repository";

export interface CustomerGoogleLoginResult {
  accessToken: string;
  customer: {
    id: string;
    email: string;
    name: string;
  };
}

@CommandHandler(CustomerGoogleLoginCommand)
export class CustomerGoogleLoginHandler implements ICommandHandler<CustomerGoogleLoginCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject("JWT_CUSTOMER_SERVICE")
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    command: CustomerGoogleLoginCommand,
  ): Promise<CustomerGoogleLoginResult> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      realtime: { transport: ws as any },
    });

    const { data, error } = await supabase.auth.getUser(
      command.supabaseAccessToken,
    );
    if (error || !data.user) {
      throw new UnauthorizedException(
        "Invalid Supabase token: " + (error?.message ?? "no user"),
      );
    }

    const { id: supabaseId, email, user_metadata } = data.user;
    if (!email) {
      throw new UnauthorizedException("Google account has no email");
    }

    const name =
      (user_metadata?.full_name as string) ||
      (user_metadata?.name as string) ||
      email.split("@")[0];

    const customer = await this.customerRepository.findOrCreateByOAuth({
      email,
      name,
      supabaseId,
    });

    if (!customer.isActive) {
      throw new UnauthorizedException("Account is disabled");
    }

    const payload = {
      sub: customer.id,
      email: customer.email,
      type: "customer",
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      customer: { id: customer.id, email: customer.email, name: customer.name },
    };
  }
}

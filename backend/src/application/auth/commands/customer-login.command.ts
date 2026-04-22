export class CustomerLoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}

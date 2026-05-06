export class UpdateColorCommand {
  constructor(
    public readonly id: string,
    public readonly color?: string,
    public readonly isActive?: boolean,
  ) {}
}

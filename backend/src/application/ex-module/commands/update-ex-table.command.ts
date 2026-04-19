export class UpdateExTableCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly updatedBy: string,
  ) {}
}

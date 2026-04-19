export class CreateExTableCommand {
  constructor(
    public readonly name: string,
    public readonly createdBy: string,
  ) {}
}

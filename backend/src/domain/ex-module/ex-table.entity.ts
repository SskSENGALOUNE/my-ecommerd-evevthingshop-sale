export class ExTable {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly createdBy: string,
    public readonly updatedAt: Date,
    public readonly updatedBy: string,
  ) {}

  static create(
    name: string,
    createdBy: string,
  ): { name: string; createdBy: string; updatedBy: string } {
    return {
      name,
      createdBy,
      updatedBy: createdBy,
    };
  }

  static reconstitute(
    id: string,
    name: string,
    createdAt: Date,
    createdBy: string,
    updatedAt: Date,
    updatedBy: string,
  ): ExTable {
    return new ExTable(id, name, createdAt, createdBy, updatedAt, updatedBy);
  }

  update(name: string, updatedBy: string): Partial<ExTable> {
    return {
      name,
      updatedBy,
    };
  }
}

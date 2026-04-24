export class Category {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) { }

  static create(
    name: string,
  ): { name: string } {
    return { name };
  }

  static reconstitute(
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): Category {
    return new Category(
      id,
      name,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }
}

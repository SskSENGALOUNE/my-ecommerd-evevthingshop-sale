export class Color {
  private constructor(
    public readonly id: string,
    public readonly color: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(color: string): { color: string; isActive: boolean } {
    return {
      color,
      isActive: true,
    };
  }

  static reconstitute(
    id: string,
    color: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): Color {
    return new Color(id, color, isActive, createdAt, updatedAt);
  }
}

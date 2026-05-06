export class Banner {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly imageUrl: string,
    public readonly linkUrl: string | null,
    public readonly isActive: boolean,
    public readonly order: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static create(
    title: string,
    imageUrl: string,
    linkUrl?: string,
    isActive?: boolean,
    order?: number,
  ): {
    title: string;
    imageUrl: string;
    linkUrl: string | null;
    isActive: boolean;
    order: number;
  } {
    return {
      title,
      imageUrl,
      linkUrl: linkUrl || null,
      isActive: isActive ?? true,
      order: order ?? 0,
    };
  }

  static reconstitute(
    id: string,
    title: string,
    imageUrl: string,
    linkUrl: string | null,
    isActive: boolean,
    order: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
  ): Banner {
    return new Banner(
      id,
      title,
      imageUrl,
      linkUrl,
      isActive,
      order,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }
}

export class CreateBannerCommand {
  constructor(
    public readonly title: string,
    public readonly imageUrl: string,
    public readonly linkUrl?: string,
    public readonly isActive?: boolean,
    public readonly order?: number,
  ) {}
}

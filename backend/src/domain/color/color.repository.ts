export interface IColorRepository {
  create(data: CreateColorData): Promise<ColorData>;
  findById(id: string): Promise<ColorData | null>;
  findAll(): Promise<ColorData[]>;
  update(id: string, data: UpdateColorData): Promise<ColorData>;
  delete(id: string): Promise<void>;
  findByColor(color: string): Promise<ColorData | null>;
}

export interface CreateColorData {
  color: string;
  isActive?: boolean;
}

export interface UpdateColorData {
  color?: string;
  isActive?: boolean;
}

export interface ColorData {
  id: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const COLOR_REPOSITORY = Symbol('COLOR_REPOSITORY');

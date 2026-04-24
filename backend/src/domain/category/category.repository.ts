export interface ICategoryRepository {
    create(data: CreateCategoryData): Promise<CategoryData>;
    findById(id: string): Promise<CategoryData | null>;
    findAll(): Promise<CategoryData[]>;
    update(id: string, data: UpdateCategoryData): Promise<CategoryData>;
    delete(id: string): Promise<void>;
    findByName(name: string): Promise<CategoryData | null>;
}

export interface CreateCategoryData {
    name: string;
}

export interface UpdateCategoryData {
    name?: string;
}

export interface CategoryData {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');
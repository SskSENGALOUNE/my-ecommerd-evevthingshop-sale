export interface IExTableRepository {
  create(data: CreateExTableData): Promise<ExTableData>;
  findById(id: string): Promise<ExTableData | null>;
  findAll(): Promise<ExTableData[]>;
  update(id: string, data: UpdateExTableData): Promise<ExTableData>;
  delete(id: string): Promise<void>;
}

export interface CreateExTableData {
  name: string;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateExTableData {
  name?: string;
  updatedBy: string;
}

export interface ExTableData {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export const EX_TABLE_REPOSITORY = Symbol('EX_TABLE_REPOSITORY');

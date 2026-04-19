export interface IExTableRepository {
  create(data: CreateExTableDto): Promise<ExTableEntity>;
  findById(id: string): Promise<ExTableEntity | null>;
  findAll(): Promise<ExTableEntity[]>;
  update(id: string, data: UpdateExTableDto): Promise<ExTableEntity>;
  delete(id: string): Promise<void>;
}

export interface CreateExTableDto {
  name: string;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateExTableDto {
  name?: string;
  updatedBy: string;
}

export class ExTableEntity {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;

  constructor(data: {
    id: string;
    name: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.createdBy = data.createdBy;
    this.updatedAt = data.updatedAt;
    this.updatedBy = data.updatedBy;
  }
}

import { Admin } from './admin.entity';

export const ADMIN_REPOSITORY = 'ADMIN_REPOSITORY';

export interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  findById(id: string): Promise<Admin | null>;
}

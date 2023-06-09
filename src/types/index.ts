export type UserType = 'SUPERADMIN' | 'ADMIN' | 'SELLER' | 'USER' | 'CLIENT';

export interface Role {
  id: number;
  name: string;
  description: string | null;
}

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  password?: string;
  roleId: number;
  role: Role;
}

export interface Client {
  id: number;
  name: string;
  lastname: string;
  phone?: string;
  mobile?: string;
  address?: string;
  email: string;
  password: string;
  roleId: number;
  role: Role;
}

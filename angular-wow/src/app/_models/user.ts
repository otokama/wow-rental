import { Role } from './role';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  customerId: string;
  role: Role;
  token?: string;
  corporate?: boolean;
}

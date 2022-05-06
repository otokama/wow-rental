import { Role } from './role';

export class User {
  email: string;
  firstName: string;
  lastName: string;
  employeeID: string;
  customerID: string;
  role: Role;
  token?: string;
  corporate?: boolean;
}

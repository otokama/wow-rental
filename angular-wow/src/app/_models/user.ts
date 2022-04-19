import { Role } from './role';

export class User {
  email: string;
  firstName: string;
  role: Role;
  token?: string;
}

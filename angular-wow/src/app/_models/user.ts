import { Role } from './role';

export class User {
  username: string;
  role: Role;
  token?: string;
}

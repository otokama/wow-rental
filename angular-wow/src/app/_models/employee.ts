import {Role} from './role';

export interface Employee {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
}

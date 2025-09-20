export class CreateUserDto {
  name?: string;
  email?: string;
  password?: string;
  organizationId?: string;
  roleIds?: string[];
}

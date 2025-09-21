export type Role = 'Owner' | 'Admin' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
}

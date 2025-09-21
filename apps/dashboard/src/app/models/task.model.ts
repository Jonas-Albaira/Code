export interface Task {
  id: string | number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  organizationId: string;
  assignedTo?: any; // could be string or object, based on your backend
}

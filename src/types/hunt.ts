export type TeamMember = 'You' | 'Ruhaan' | 'Daksh';

export type Assignee =
  | 'You'
  | 'Ruhaan'
  | 'Daksh'
  | 'You + Ruhaan'
  | 'You + Daksh'
  | 'Ruhaan + Daksh'
  | 'You + Ruhaan + Daksh'
  | 'Unassigned';

export type TaskStatus = 'Not Started' | 'Discussing' | 'In Progress' | 'Blocked' | 'Done';

export type Priority = 'Low' | 'Normal' | 'High' | 'Critical';

export type Category =
  | 'Website'
  | 'Puzzle'
  | 'Story'
  | 'ORBIT'
  | 'ORB'
  | 'Technical'
  | 'Authentication'
  | 'Testing'
  | 'UI/UX'
  | 'Content'
  | 'Other';

export interface Task {
  id: string;
  order: number;
  title: string;
  assignees: Assignee;
  status: TaskStatus;
  priority: Priority;
  category: Category;
  notes: string;
  dependency?: string;
  createdAt: number;
  updatedAt: number;
}

export interface BrainstormIdea {
  id: string;
  idea: string;
  notes: string;
  suggestedBy: TeamMember | 'All';
  createdAt: number;
}

export interface DecisionNote {
  id: string;
  topic: string;
  decision: string;
  status: 'Open' | 'Resolved' | 'In Progress';
  updatedAt: number;
}

export type SortOption = 'manual' | 'priority' | 'status' | 'assignee' | 'category';
export type FilterAssignee = 'All' | Assignee;
export type FilterStatus = 'All' | TaskStatus;
export type FilterPriority = 'All' | Priority;
export type FilterCategory = 'All' | Category;

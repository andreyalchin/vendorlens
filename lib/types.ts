export type ToolStatus = 'active' | 'review' | 'deprecated';
export type ToolCategory =
  | 'Communication'
  | 'Project Management'
  | 'CRM'
  | 'Design'
  | 'HR'
  | 'Docs'
  | 'Security'
  | 'Analytics'
  | 'Development'
  | 'Other';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  monthlyCost: number;
  seats: number;
  owner: string;
  renewalDate: string; // ISO date string
  status: ToolStatus;
}

export type RequestStatus = 'pending' | 'approved' | 'denied';
export type Urgency = 'low' | 'medium' | 'high';

export interface ApprovalRequest {
  id: string;
  toolName: string;
  category: ToolCategory;
  useCase: string;
  estimatedMonthlyCost: number;
  urgency: Urgency;
  requester: string;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerComment?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  employees: number;
}

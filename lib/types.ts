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

export interface ContractClause {
  summary: string;
  clause_snippet: string;
}

export interface ContractAnalysis {
  risk_score: number;
  risk_summary: string;
  pricing_structure: ContractClause;
  renewal_terms: ContractClause & { notice_deadline_days: number | null; renewal_date: string | null };
  escalation_risk: ContractClause & { annual_increase_pct: number | null };
  hidden_costs: ContractClause;
  vendor_lock_in: ContractClause & { severity: 'low' | 'medium' | 'high' };
  negotiation_recommendations: string[];
  procurement_insights: {
    vendor_leverage: 'low' | 'medium' | 'high';
    buyer_leverage: 'low' | 'medium' | 'high';
    negotiation_difficulty: 'easy' | 'moderate' | 'hard';
    recommended_priorities: string[];
  };
  vendor_benchmark: {
    vendor_name: string;
    risk_profile: string;
    typical_discount_range: string;
    known_tactics: string[];
  };
  timeline: {
    contract_start: string | null;
    notice_deadline: string | null;
    renewal_date: string | null;
  };
}

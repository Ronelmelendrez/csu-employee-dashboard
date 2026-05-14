export interface Employee {
  id: number;
  no: string | number;
  currentRank: string;
  officialStation: string;
  categoryOfEmployment: string;
  employmentStatus: string;
  courseProgram: string;
  fundingSource: string;
  universityAttended: string;
  contractDuration: string;
  reinstatement: string;
  schoolingStatus: string;
  graduationDate: string;
  connectedWithCSU: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  contractual: number;
  permanent: number;
  connected: number;
  byRank: Record<string, number>;
  byStation: Record<string, number>;
}
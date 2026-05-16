export type CSUConnectionStatus = 'YES' | 'NO' | 'DECEASED';

export interface Employee {
  id: number;
  no?: string | number;
  dateOfBirth?: string;
  name?: string;
  address?: string;
  currentRank: string;
  officialStation: string;
  categoryOfEmployment: string;
  employmentStatus: string;
  courseProgram: string;
  fundingSource: string;
  universityAttended: string;
  contractDuration: string;
  leaveOfAbsence?: string;
  resolutionOfStudyLeave?: string;
  reinstatement: string;
  schoolingStatus: string;
  graduationDate: string;
  clothingAllowanceAndPBB?: string;
  connectedWithCSU: CSUConnectionStatus;
  returnService?: string;
  enrolled?: string;
  remarks?: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  contractual: number;
  permanent: number;
  connected: number;
  deceased: number;
  byRank: Record<string, number>;
  byStation: Record<string, number>;
}
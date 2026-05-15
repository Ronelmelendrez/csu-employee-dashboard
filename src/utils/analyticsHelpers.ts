import { Employee, EmployeeStats } from '../types/employee';

export const computeStats = (employees: Employee[]): EmployeeStats => {
  const stats: EmployeeStats = {
    total: employees.length,
    active: 0,
    contractual: 0,
    permanent: 0,
    connected: 0,
    byRank: {},
    byStation: {},
  };

  employees.forEach((emp) => {
    // Active: still connected with CSU
    if (emp.connectedWithCSU?.toLowerCase() === 'yes') stats.active++;
    // Contractual
    if (emp.employmentStatus?.toLowerCase().includes('contractual')) stats.contractual++;
    // Permanent
    if (emp.employmentStatus?.toLowerCase() === 'permanent') stats.permanent++;
    // Connected
    if (emp.connectedWithCSU?.toLowerCase() === 'yes') stats.connected++;
    // By Rank
    const rank = emp.currentRank || 'Unknown';
    stats.byRank[rank] = (stats.byRank[rank] || 0) + 1;
    // By Station
    const station = emp.officialStation || 'Unknown';
    stats.byStation[station] = (stats.byStation[station] || 0) + 1;
  });

  return stats;
};

export const getEmploymentStatusDistribution = (employees: Employee[]) => {
  const distribution: Record<string, number> = {};
  employees.forEach((emp) => {
    const status = emp.employmentStatus || 'Unknown';
    distribution[status] = (distribution[status] || 0) + 1;
  });
  return Object.entries(distribution).map(([name, value]) => ({ name, value }));
};

export const getGraduationTrends = (employees: Employee[]) => {
  const yearMap: Record<string, number> = {};
  employees.forEach((emp) => {
    if (emp.graduationDate) {
      const year = emp.graduationDate.split('-')[0];
      yearMap[year] = (yearMap[year] || 0) + 1;
    }
  });
  return Object.entries(yearMap)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));
};

export const getFundingSourceBreakdown = (employees: Employee[]) => {
  const breakdown: Record<string, number> = {};
  employees.forEach((emp) => {
    const source = emp.fundingSource || 'Unknown';
    breakdown[source] = (breakdown[source] || 0) + 1;
  });
  return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
};

export const getUniversityStatistics = (employees: Employee[]) => {
  const universityMap: Record<string, number> = {};
  employees.forEach((emp) => {
    const uni = emp.universityAttended || 'Unknown';
    universityMap[uni] = (universityMap[uni] || 0) + 1;
  });
  return Object.entries(universityMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
};

export type ScholarStats = {
  ongoingTeaching: number;
  ongoingTeachingReinstatedPartTime: number;
  ongoingAdmin: number;
  totalOngoing: number;
  completedTeaching: number;
  completedAdmin: number;
  totalCompleted: number;
};

const normalizeText = (value: unknown) =>
  String(value ?? '').toLowerCase().replace(/\s+/g, ' ').trim();

const textHasAny = (value: unknown, keywords: string[]) => {
  const text = normalizeText(value);
  if (!text) return false;
  return keywords.some((keyword) => text.includes(keyword));
};

const isTeachingRole = (emp: Employee) => {
  const category = normalizeText(emp.categoryOfEmployment);
  return textHasAny(category, ['teaching']);
};

const isAdminRole = (emp: Employee) => {
  const category = normalizeText(emp.categoryOfEmployment);
  if (!category) return false;
  return textHasAny(category, ['non-teaching', 'non teaching', 'admin', 'administrative']);
};

const isReinstatedOrPartTime = (emp: Employee) => {
  const reinstatement = normalizeText(emp.reinstatement);
  const status = normalizeText(emp.employmentStatus);

  if (reinstatement && reinstatement !== '0') return true;

  return textHasAny(status, ['part-time', 'part time', 'reinstated']);
};

const isCompleted = (emp: Employee) => {
  const status = normalizeText(emp.schoolingStatus);
  if (textHasAny(status, ['graduated', 'completed', 'finished'])) return true;
  return Boolean(normalizeText(emp.graduationDate));
};

const isOngoing = (emp: Employee) => {
  const status = normalizeText(emp.schoolingStatus);
  return textHasAny(status, ['ongoing', 'on going', 'on-going', 'in progress', 'in-progress', 'currently enrolled', 'enrolled']);
};

export const computeEmployeeScholarStats = (employees: Employee[]): ScholarStats => {
  const stats: ScholarStats = {
    ongoingTeaching: 0,
    ongoingTeachingReinstatedPartTime: 0,
    ongoingAdmin: 0,
    totalOngoing: 0,
    completedTeaching: 0,
    completedAdmin: 0,
    totalCompleted: 0,
  };

  const seenOngoingTeaching = new Set<string>();
  const seenOngoingTeachingReinstated = new Set<string>();
  const seenOngoingAdmin = new Set<string>();
  const seenCompletedTeaching = new Set<string>();
  const seenCompletedAdmin = new Set<string>();

  employees.forEach((emp) => {
    const teaching = isTeachingRole(emp);
    const admin = !teaching && isAdminRole(emp);
    const ongoing = isOngoing(emp);
    const completed = isCompleted(emp);
    const nameKey = normalizeText(emp.name) || normalizeText(emp.no);

    if (ongoing) {
      if (teaching) {
        if (nameKey && !seenOngoingTeaching.has(nameKey)) {
          seenOngoingTeaching.add(nameKey);
          stats.ongoingTeaching += 1;
        }
        if (isReinstatedOrPartTime(emp) && nameKey && !seenOngoingTeachingReinstated.has(nameKey)) {
          seenOngoingTeachingReinstated.add(nameKey);
          stats.ongoingTeachingReinstatedPartTime += 1;
        }
      } else if (admin) {
        if (nameKey && !seenOngoingAdmin.has(nameKey)) {
          seenOngoingAdmin.add(nameKey);
          stats.ongoingAdmin += 1;
        }
      }
    }

    if (completed) {
      if (teaching) {
        if (nameKey && !seenCompletedTeaching.has(nameKey)) {
          seenCompletedTeaching.add(nameKey);
          stats.completedTeaching += 1;
        }
      } else if (admin) {
        if (nameKey && !seenCompletedAdmin.has(nameKey)) {
          seenCompletedAdmin.add(nameKey);
          stats.completedAdmin += 1;
        }
      }
    }
  });

  stats.totalOngoing = stats.ongoingTeaching + stats.ongoingTeachingReinstatedPartTime + stats.ongoingAdmin;
  stats.totalCompleted = stats.completedTeaching + stats.completedAdmin;

  return stats;
};
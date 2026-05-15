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

const TEACHING_STATIONS = new Set([
  'ccis',
  'caa',
  'cofes',
  'chass',
  'cegs',
  'ced',
  'cmns'
]);

const isTeachingRole = (emp: Employee) => {
  const station = normalizeText(emp.officialStation);
  return TEACHING_STATIONS.has(station);
};

const isAdminRole = (emp: Employee) => {
  const station = normalizeText(emp.officialStation);
  if (!station) return false;
  return !TEACHING_STATIONS.has(station);
};

const isReinstatedOrPartTime = (emp: Employee) => {
  const reinstatement = normalizeText(emp.reinstatement);
  const status = normalizeText(emp.employmentStatus);
  return (
    textHasAny(reinstatement, ['yes', 'reinstated']) ||
    textHasAny(status, ['part-time', 'part time', 'reinstated'])
  );
};

const isCompleted = (emp: Employee) => {
  const status = normalizeText(emp.schoolingStatus);
  if (textHasAny(status, ['completed', 'graduated', 'finished'])) return true;
  return Boolean(normalizeText(emp.graduationDate));
};

const isOngoing = (emp: Employee) => {
  const status = normalizeText(emp.schoolingStatus);
  if (textHasAny(status, ['ongoing', 'in progress', 'in-progress', 'currently enrolled', 'enrolled'])) {
    return true;
  }
  return !isCompleted(emp) && Boolean(status);
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

  const uniqueEmployees = Array.from(
    employees.reduce((map, emp) => {
      const nameKey = normalizeText(emp.name);
      const schoolingKey = normalizeText(emp.schoolingStatus);
      const key = nameKey ? `${nameKey}::${schoolingKey}` : `${normalizeText(emp.no)}::${schoolingKey}`;
      if (key && !map.has(key)) {
        map.set(key, emp);
      }
      return map;
    }, new Map<string, Employee>()).values()
  );

  uniqueEmployees.forEach((emp) => {
    const teaching = isTeachingRole(emp);
    const admin = !teaching && isAdminRole(emp);
    const ongoing = isOngoing(emp);
    const completed = isCompleted(emp);

    if (ongoing) {
      if (teaching) {
        stats.ongoingTeaching += 1;
        if (isReinstatedOrPartTime(emp)) {
          stats.ongoingTeachingReinstatedPartTime += 1;
        }
      } else if (admin) {
        stats.ongoingAdmin += 1;
      }
    }

    if (completed) {
      if (teaching) {
        stats.completedTeaching += 1;
      } else if (admin) {
        stats.completedAdmin += 1;
      }
    }
  });

  stats.totalOngoing = stats.ongoingTeaching + stats.ongoingTeachingReinstatedPartTime + stats.ongoingAdmin;
  stats.totalCompleted = stats.completedTeaching + stats.completedAdmin;

  return stats;
};
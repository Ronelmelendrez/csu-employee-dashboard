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
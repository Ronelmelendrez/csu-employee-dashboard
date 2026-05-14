import { Employee } from '../types/employee';

export const exportToCSV = (employees: Employee[], filename: string) => {
  const headers = [
    'No.', 'Current Rank', 'Official Station', 'Category of Employment',
    'Employment Status', 'Course/Program', 'Funding Source', 'University Attended',
    'Contract Duration', 'Reinstatement', 'Schooling Status', 'Graduation Date',
    'Still Connected with CSU?'
  ];

  const rows = employees.map(emp => [
    emp.no, emp.currentRank, emp.officialStation, emp.categoryOfEmployment,
    emp.employmentStatus, emp.courseProgram, emp.fundingSource, emp.universityAttended,
    emp.contractDuration, emp.reinstatement, emp.schoolingStatus, emp.graduationDate,
    emp.connectedWithCSU
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
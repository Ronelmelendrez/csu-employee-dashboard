import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../store/appStore';
import { Employee } from '../types/employee';

export const useEmployees = () => {
  const { employees, setEmployees, setIsLoading } = useAppStore();
  const queryClient = useQueryClient();

  const query = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => employees,
    initialData: employees,
    staleTime: Infinity,
  });

  const updateEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    queryClient.setQueryData(['employees'], newEmployees);
  };

  return {
    employees: query.data,
    isLoading: query.isLoading,
    updateEmployees,
  };
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationAPI } from '../utils/api';

export const useMyApplication = () => {
    return useQuery({
        queryKey: ['myApplication'],
        queryFn: async () => {
            const { data } = await applicationAPI.getMyApplication();
            return data.data;
        },
        retry: 1
    });
};

export const useSubmitApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => applicationAPI.submit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myApplication'] });
        }
    });
};

export const useSubmitTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, link }) => applicationAPI.submitTask(taskId, link),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myApplication'] });
        }
    });
};

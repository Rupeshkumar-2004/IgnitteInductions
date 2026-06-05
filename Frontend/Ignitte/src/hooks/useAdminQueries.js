import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../utils/api';

export const useAdminStats = () => {
    return useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const { data } = await adminAPI.getDashboardStats();
            return data.data.stats;
        }
    });
};

export const useApplications = (params) => {
    return useQuery({
        queryKey: ['applications', params],
        queryFn: async () => {
            const { data } = await adminAPI.getAllApplications(params);
            return data.data.applications;
        }
    });
};

export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => adminAPI.updateStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        }
    });
};

export const useAssignTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => adminAPI.assignTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
    });
};

export const useVerifyTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appId, taskId, data }) => adminAPI.verifyTask(appId, taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
    });
};

export const useCreateTeamMember = () => {
    return useMutation({
        mutationFn: (data) => adminAPI.createTeamMember(data),
    });
};

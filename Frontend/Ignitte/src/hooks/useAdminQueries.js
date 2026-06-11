import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../utils/api';

// custom hook for getting the admin stats
// useQuery is a hook that is used to fetch the data from the server
// queryKey is a unique key for the query
// queryFn is a function that will fetch the data from the server
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => adminAPI.createTeamMember(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
        }
    });
};

export const useTeamMembers = () => {
    return useQuery({
        queryKey: ['teamMembers'],
        queryFn: async () => {
            const { data } = await adminAPI.getTeamMembers();
            return data.data;
        }
    });
};

export const useRemoveTeamMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => adminAPI.removeTeamMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
        }
    });
};

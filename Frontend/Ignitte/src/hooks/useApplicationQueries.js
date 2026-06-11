import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationAPI } from '../utils/api';

// custom hook for getting the user's application
// useQuery is a hook that is used to fetch the data from the server
// queryKey is a unique key for the query
// queryFn is a function that will fetch the data from the server
export const useMyApplication = () => {
    return useQuery({
        queryKey: ['myApplication'],
        queryFn: async () => {
            const { data } = await applicationAPI.getMyApplication();
            return data.data;
        },
        // retry: 1 means it will retry only once if the query fails
        retry: 1
    });
};

// useMutation is a hook that is used to mutate the data
// useQueryClient is used to invalidate the queries
// mutationFn is the function that will be called when the mutation is triggered
// onSuccess is a callback function that will be called when the mutation is successful
// onError is a callback function that will be called when the mutation fails
// onMutate is a callback function that will be called before the mutation is triggered
export const useSubmitApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        // mutationFn is the function that will be called when the mutation is triggered
        mutationFn: (data) => applicationAPI.submit(data),
        // onSuccess is a callback function that will be called when the mutation is successful
        onSuccess: () => {
            // invalidateQueries is used to invalidate the queries
            // invalidation of queries will cause the queries to be re-fetched
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

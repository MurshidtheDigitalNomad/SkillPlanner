import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

//fetching roadmaps
export function useUserRoadmaps(userId) {
  return useQuery({
    queryKey: ['roadmaps', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await axios.get(`http://localhost:8000/api/roadmaps/${userId}`);
      return res.data;
    },
  });
}

export function useAddRoadmapMutation(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roadmap, milestones }) => {
      const res = await axios.post(`http://localhost:8000/api/roadmaps/add/${userId}`, { roadmap, milestones });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps', userId] });
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    }
  });
}

// Tracking Roadmaps
export function useUserProgress(userId) {
  return useQuery({
    queryKey: ['progress', userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await axios.get(`http://localhost:8000/api/roadmaps/user/${userId}/progress`);
      return res.data;
    },
    enabled: !!userId
  });
}

export function useRoadmapProgress(roadmapId) {
  return useQuery({
    queryKey: ['roadmap-progress', roadmapId],
    queryFn: async () => {
      if (!roadmapId) return null;
      const res = await axios.get(`http://localhost:8000/api/roadmaps/${roadmapId}/progress`);
      return res.data;
    },
    enabled: !!roadmapId
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, status }) => {
      const res = await axios.put(`http://localhost:8000/api/task/${taskId}/status`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });
}

export function useUpdateMilestoneStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ milestoneId, status }) => {
      const res = await axios.put(`http://localhost:8000/api/milestone/${milestoneId}/status`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    }
  });
}

//Deleting Roadmaps
export function useDeleteRoadmapMutation(userId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roadmapId }) => {
      const res = await axios.delete(`http://localhost:8000/api/roadmaps/${userId}/${roadmapId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps', userId] });
      queryClient.invalidateQueries({ queryKey: ['progress', userId] });
    }
  });
}

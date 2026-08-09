import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../utils/api";
import type { Job } from '../types/type';

type JobState = {
    Jobs: Job[];
    loading: boolean;
    profileLoading: boolean;
    selectedJob: Job | null;
    error: string | null;
    totalCount: number;
};

const initialState: JobState = {
    Jobs: [],
    selectedJob: null,
    profileLoading: false,
    totalCount: 0,
    loading: false,
    error: null,
};

export const fetchJobs = createAsyncThunk<
    { data: Job[]; totalCount: number }, 
    { pageIndex: number; pageSize: number }
>('jobs/fetchJobs', async ({ pageIndex, pageSize }, { rejectWithValue }) => {
    try {
        const response = await api.get('/jobs', {
            params: {
                page: pageIndex + 1,
                limit: pageSize
            }
        });
        return {
            data: response.data.data,
            totalCount: response.data.totalCount
        };
    } catch (error: any) { 
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
    }
});

export const fetchJobById = createAsyncThunk<Job, string>(
    'jobs/fetchJobById', 
    async (jobId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/jobs/${jobId}`);
        
            return response.data.data as Job;
        } catch (error: any) { 
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch job profile');
        }
    }
);

export const deleteJob = createAsyncThunk<number, number>(
    "jobs/deleteJob", 
    async (jobId: number, { rejectWithValue }) => {
        try { 
            await api.delete(`/jobs/${jobId}`);
            return jobId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete job');
        }
    }
);

const jobSlice = createSlice({
    name: 'Jobs',
    initialState,
    reducers: {
        clearSelectedJob(state) { 
            state.selectedJob = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Jobs
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<{ data: Job[]; totalCount: number }>) => {
                state.loading = false;
                state.Jobs = action.payload.data;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchJobs.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? 'Failed to fetch jobs';
            })

            // Fetch Job By ID
            .addCase(fetchJobById.pending, (state) => {
                state.profileLoading = true;
                state.error = null;
            })
            .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
                state.profileLoading = false;
                state.selectedJob = action.payload;
            })
            .addCase(fetchJobById.rejected, (state, action: any) => {
                state.profileLoading = false;
                state.error = action.payload ?? action.error.message ?? 'Failed to fetch job';
            })

            // Delete Job
            .addCase(deleteJob.fulfilled, (state, action: PayloadAction<number>) => {
                state.Jobs = state.Jobs.filter((job) => job.id !== action.payload);
                state.totalCount = Math.max(0, state.totalCount - 1);
            })
            .addCase(deleteJob.rejected, (state, action: any) => {
                state.error = action.payload ?? action.error.message ?? 'Failed to delete job';
            });
    },
});

export const { clearSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
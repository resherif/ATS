import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";
import type { Job } from '../types/type';
type JobState = {
    Jobs: Job[],
    loading: boolean,
    error: string | null;
}
const initialState: JobState= {
    Jobs: [],
    loading: false,
    error:null,
}
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
    const { data, error } = await supabase.from('jobs').select("*");
    if (error) throw new Error(error.message);
    return data as Job[];
});
export const deleteJob = createAsyncThunk("Jobs/deleteJob", async (id: string) => {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return id;
});
const jobSlice = createSlice({
    name: 'Jobs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
                state.loading = false;
                state.Jobs = action.payload;

            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'failed to fetch jobs'
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
               state.Jobs= state.Jobs.filter((Job) => Job.id !== action.payload)
            });
        
    },
    
});
export default jobSlice.reducer;

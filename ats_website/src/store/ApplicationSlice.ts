import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";
import type { Application } from "../types/type";
type ApplicationState = {
    Applications: Application[];
  loading: boolean;
  error: string | null;
  success: boolean;
};

const initialState: ApplicationState = {
    Applications: [],
  loading: false,
  error: null,
  success: false,
};
export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
    async () => { 
        const { data, error } = await supabase.from("applications").select("*");
      if (error) throw new Error(error.message);
      return data as Application[];
    }
);

export const applyToJob = createAsyncThunk(
  "applications/applyToJob",
    async ({ candidate_id, job_id }: { candidate_id: number; job_id: number }) => {
      
    const { error } = await supabase
      .from("applications")
      .insert({
        candidate_id: candidate_id,
        job_id: job_id,
        status: "Pending",
      });

    if (error) throw new Error(error.message);
  }
);
export const deleteApplications = createAsyncThunk('applications/deleteApplications', async (application_id: number
) => {
    const { error } = await supabase.from('applications').delete().eq("application_id", application_id);
    if(error) throw new Error(error.message)
    return application_id;
})
const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    resetApplyState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchApplications.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchApplications.fulfilled, (state, action:  PayloadAction< Application[]> ) => {
          state.loading = false;
          state.Applications = action.payload;
        })
        .addCase(fetchApplications.rejected, (state, action ) => {
          state.loading = false;
          state.error = action.error.message || "Failed to fetch applications";
        })
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Apply failed";
      });
  },
});

export const { resetApplyState } = applicationSlice.actions;
export default applicationSlice.reducer;
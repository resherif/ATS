import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../utils/api";
import type { Application } from "../types/type";

type ApplicationState = {
  Applications: Application[];
  selectedApplication: Application | null;
  totalCount: number; //
  ApplicationLoading: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
};

const initialState: ApplicationState = {
  Applications: [],
  selectedApplication: null,
  totalCount: 0,
  ApplicationLoading: false,
  loading: false,
  error: null,
  success: false,
};


export const fetchApplications = createAsyncThunk<
  { data: Application[]; totalCount: number },
  { pageIndex: number, pageSize: number }
>(
  "applications/fetchApplications",
  async ({ pageIndex, pageSize }, { rejectWithValue }) => {
    try {
      const response = await api.get('/applications', {
        params: {
          page: pageIndex + 1,
          limit: pageSize,
        },
      });
      return {
        data: response.data.data,
        totalCount: response.data.totalCount,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

// Apply To Job 
export const applyToJob = createAsyncThunk<
  Application,
  { candidate_id: number; job_id: number }
>(
  "applications/applyToJob",
  async ({ candidate_id, job_id }, { rejectWithValue }) => {
    try {
      
      const response = await api.post('/applications', { candidate_id, job_id });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to apply to job');
    }
  }
);

//  Delete Application 
export const deleteApplications = createAsyncThunk<
  number,
  number
>(
  'applications/deleteApplications',
  async (application_id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/applications/${application_id}`);
      return application_id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete application');
    }
  }
);

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
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchApplications.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Application[]; totalCount: number }>
        ) => {
          state.loading = false;
          state.Applications = action.payload.data;
          state.totalCount = action.payload.totalCount;
        }
      )
      .addCase(fetchApplications.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch applications";
      })

      // Apply To Job
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(applyToJob.fulfilled, (state, action: PayloadAction<Application>) => {
        state.loading = false;
        state.success = true;
        state.Applications.push(action.payload);
        state.totalCount += 1;
      })
      .addCase(applyToJob.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Apply failed";
      })

      // Delete Application
      .addCase(deleteApplications.fulfilled, (state, action: PayloadAction<number>) => {
        state.Applications = state.Applications.filter(
          (app) => app.application_id !== action.payload
        );
        state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteApplications.rejected, (state, action: any) => {
        state.error = action.payload ?? action.error.message ?? "Failed to delete application";
      });
  },
});

export const { resetApplyState } = applicationSlice.actions;
export default applicationSlice.reducer;
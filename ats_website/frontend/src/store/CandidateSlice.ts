import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../utils/api";;
import type { Candidates } from '../types/type';
type CandidateState = {
    Candidate: Candidates[],
    selectedCandidate: Candidates | null,
    profileLoading:boolean,
    loading: boolean,
    error: string | null,
    totalCount:number,
}
const initialState: CandidateState = {
    Candidate:  [],
    selectedCandidate: null,
    profileLoading:false,
    totalCount:0,
    loading: false,
    error:null,
}
export const fetchCandidates = createAsyncThunk<{ data: Candidates[], totalCount: number }, { pageIndex: number,pageSize: number }>(
    "candidates/fetchCandidates",
    async ({ pageIndex, pageSize }, { rejectWithValue }) => {
        try {
            const response = await api.get('/candidates', {
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
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidates');
        }
    }
);
export const fetchCandidateById = createAsyncThunk('candidates/fetchCandidateById', async (candidateId: string,{ rejectWithValue }) => {
    try {
        const response = await api.get(`/candidates/${candidateId}`);
        return response.data as Candidates;
    } catch (error: any) { 
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch candidate profile ');

    }
})
export const deleteCandidates = createAsyncThunk('candidates/deleteCandidates', async (candidate_id: string, { rejectWithValue}) => {
    try {
        await api.delete(`/candidates/${candidate_id}`);
        return candidate_id;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete candidate');
    }
})
const CandidateSlice = createSlice({
    name: 'Candidate',
    initialState,
    reducers: {
        clearSelectedCandidate(state) {
            state.selectedCandidate = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCandidates.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(
                fetchCandidates.fulfilled,
                (state, action: PayloadAction<{ data: Candidates[], totalCount: number }>) => {
                    state.loading = false;
                    state.Candidate = action.payload.data;
                    state.totalCount = action.payload.totalCount;
                }
            )
            .addCase(fetchCandidates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'failed to fetch Candidates'
            })
            //Fetch Candidate By Id
            .addCase(fetchCandidateById.pending, (state) => {
                state.profileLoading = true;
                state.error = null;

            }).addCase(fetchCandidateById.fulfilled, (state, action: PayloadAction<Candidates>) => {
                state.profileLoading = false;

                state.selectedCandidate = action.payload;

            })
            .addCase(fetchCandidateById.rejected, (state, action:any) => {
                state.profileLoading = false;
                state.error = action.error.message ?? 'Failed to fetch candidate';
            })
            .addCase(deleteCandidates.fulfilled, (state, action) => {
                state.Candidate = state.Candidate.filter((Candidate) => Candidate.candidate_id !== action.payload.toString());
                state.totalCount = Math.max(0, state.totalCount - 1);
            });

    }
});
export const { clearSelectedCandidate } = CandidateSlice.actions;
export default CandidateSlice.reducer;
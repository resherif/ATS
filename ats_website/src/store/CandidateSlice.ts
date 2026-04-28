import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";
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
export const fetchCandidates = createAsyncThunk<{ data: Candidates[], totalCount: number }, { pageIndex: number; pageSize: number }>(
    "candidates/fetchCandidates",
    async ({ pageIndex, pageSize }) => {
        const from = pageIndex * pageSize;
        const to = from + pageSize - 1;
        const { data, error, count } = await supabase
            .from('candidate_list_view')
            .select('*', { count: 'exact' })
            .order("applied_at", { ascending: false })
            .range(from, to);
        if (error) throw new Error(error.message);

        return { data: data as Candidates[], totalCount: count ?? 0 };
    }
);
export const fetchCandidateById = createAsyncThunk('candidates/fetchCandidateById', async (candidateId: string) => {
    const { data, error } = await supabase.from('candidate_list_view').select('*').eq('candidate_id', candidateId).single();
    if (error) throw new Error(error.message);
    return data as Candidates;
})
export const deleteCandidates = createAsyncThunk('candidates/deleteCandidates', async (candidate_id:string) => {
    const { error } = await supabase.from('candidates').delete().eq("candidate_id", candidate_id);
    if(error) throw new Error(error.message)
    return candidate_id;
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
                (state, action: PayloadAction<{ data: Candidates[]; totalCount: number }>) => {
                    state.loading = false;
                    state.Candidate = action.payload.data;
                    state.totalCount = action.payload.totalCount;
                }
            )
            .addCase(fetchCandidates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'failed to fetch Candidates'
            })
            .addCase(fetchCandidateById.pending, (state) => {
                state.profileLoading = true;
            }).addCase(fetchCandidateById.fulfilled, (state, action: PayloadAction<Candidates>) => {
                state.profileLoading = false;
                state.selectedCandidate = action.payload;
            }).addCase(fetchCandidateById.rejected, (state, action) => {
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
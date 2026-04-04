import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";
import type { Candidates } from '../types/type';
type CandidateState = {
    Candidate: Candidates[],
    loading: boolean,
    error:string|null
}
const initialState: CandidateState = {
    Candidate: [],
    loading: false,
    error:null,
}
export const fetchCandidates = createAsyncThunk("candidates/fetchCandidates",async () => {
  
    const { data, error } = await supabase.from('candidates').select(`
            candidate_id,
            candidate_name,
            email,
            created_at,
            resume_url,
            applications (
                status,
                applied_at,
                job_id,
                jobs (job_title)
            ),
            candidate_skills (
                skills (skill_name, skill_id)
            )
        `).order("applied_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as any[];

});
export const deleteCandidates = createAsyncThunk('candidates/deleteCandidates', async (candidate_id:number) => {
    const { error } = await supabase.from('candidates').delete().eq("id", candidate_id);
    if(error) throw new Error(error.message)
    return candidate_id;
})
const CandidateSlice = createSlice({
    name: 'Candidate',
    initialState,
    reducers: {},
    extraReducers:(builder) =>{
    builder .addCase(fetchCandidates.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                })
                .addCase(fetchCandidates.fulfilled, (state, action: PayloadAction<Candidates[]>) => {
                    state.loading = false;
                    state.Candidate = action.payload;
    
                })
                .addCase(fetchCandidates.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message ?? 'failed to fetch Candidates'
                })
                .addCase(deleteCandidates.fulfilled, (state, action) => {
                    state.Candidate = state.Candidate.filter((Candidate) => Candidate.candidate_id !== action.payload);
                });
                   
    }
})
export default CandidateSlice.reducer;
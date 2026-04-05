import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../utils/supabaseClient";
import type { Candidates } from '../types/type';
type CandidateState = {
    Candidate: Candidates[],
    loading: boolean,
    error:string|null
}
const initialState: CandidateState = {
    Candidate:  [
    {
        candidate_id: '1',
        candidate_name: "Reham Sherif",
        email: "reham@example.com",
        created_at: "2026-04-01T10:00:00Z",
        skills: [
            { skill_id: 101, skill_name: "React" },
            { skill_id: 102, skill_name: "TypeScript" }
        ],
        application_id: 501,
        job_id: 10,
        status: "Interviewing",
        applied_at: "2026-04-02T12:30:00Z",
        resume_url: "https://example.com/resume-reham.pdf",
        role: "Frontend Developer"
    },
    {
        candidate_id: '2',
        candidate_name: "Ahmed Ali",
        email: "ahmed@example.com",
        created_at: "2026-03-28T09:00:00Z",
        skills: [
            { skill_id: 103, skill_name: "Node.js" },
            { skill_id: 104, skill_name: "PostgreSQL" }
        ],
        application_id: 502,
        job_id: 11,
        status: "Hired",
        applied_at: "2026-03-29T15:00:00Z",
        resume_url: "https://example.com/resume-ahmed.pdf",
        role: "Backend Developer"
        },
    {
        candidate_id: '1',
        candidate_name: "Reham Sherif",
        email: "reham@example.com",
        created_at: "2026-04-01T10:00:00Z",
        skills: [
            { skill_id: 101, skill_name: "React" },
            { skill_id: 102, skill_name: "TypeScript" }
        ],
        application_id: 501,
        job_id: 10,
        status: "Interviewing",
        applied_at: "2026-04-02T12:30:00Z",
        resume_url: "https://example.com/resume-reham.pdf",
        role: "Frontend Developer"
    },
    {
        candidate_id: '2',
        candidate_name: "Ahmed Ali",
        email: "ahmed@example.com",
        created_at: "2026-03-28T09:00:00Z",
        skills: [
            { skill_id: 103, skill_name: "Node.js" },
            { skill_id: 104, skill_name: "PostgreSQL" }
        ],
        application_id: 502,
        job_id: 11,
        status: "Hired",
        applied_at: "2026-03-29T15:00:00Z",
        resume_url: "https://example.com/resume-ahmed.pdf",
        role: "Backend Developer"
        },
    {
        candidate_id: '1',
        candidate_name: "Reham Sherif",
        email: "reham@example.com",
        created_at: "2026-04-01T10:00:00Z",
        skills: [
            { skill_id: 101, skill_name: "React" },
            { skill_id: 102, skill_name: "TypeScript" }
        ],
        application_id: 501,
        job_id: 10,
        status: "Interviewing",
        applied_at: "2026-04-02T12:30:00Z",
        resume_url: "https://example.com/resume-reham.pdf",
        role: "Frontend Developer"
    },
    {
        candidate_id: '2',
        candidate_name: "Ahmed Ali",
        email: "ahmed@example.com",
        created_at: "2026-03-28T09:00:00Z",
        skills: [
            { skill_id: 103, skill_name: "Node.js" },
            { skill_id: 104, skill_name: "PostgreSQL" }
        ],
        application_id: 502,
        job_id: 11,
        status: "Hired",
        applied_at: "2026-03-29T15:00:00Z",
        resume_url: "https://example.com/resume-ahmed.pdf",
        role: "Backend Developer"
    },{
        candidate_id: '1',
        candidate_name: "Reham Sherif",
        email: "reham@example.com",
        created_at: "2026-04-01T10:00:00Z",
        skills: [
            { skill_id: 101, skill_name: "React" },
            { skill_id: 102, skill_name: "TypeScript" }
        ],
        application_id: 501,
        job_id: 10,
        status: "Interviewing",
        applied_at: "2026-04-02T12:30:00Z",
        resume_url: "https://example.com/resume-reham.pdf",
        role: "Frontend Developer"
    },
    {
        candidate_id: '2',
        candidate_name: "Ahmed Ali",
        email: "ahmed@example.com",
        created_at: "2026-03-28T09:00:00Z",
        skills: [
            { skill_id: 103, skill_name: "Node.js" },
            { skill_id: 104, skill_name: "PostgreSQL" }
        ],
        application_id: 502,
        job_id: 11,
        status: "Hired",
        applied_at: "2026-03-29T15:00:00Z",
        resume_url: "https://example.com/resume-ahmed.pdf",
        role: "Backend Developer"
    }
],
    loading: false,
    error:null,
}
export const fetchCandidates = createAsyncThunk("candidates/fetchCandidates",async ({}) => {
  
    const { data, error } = await supabase.from('candidate_list_view').select('*').order("applied_at", {  ascending: false });
    if (error) throw new Error(error.message);
   
    return data as Candidates[];

});
export const deleteCandidates = createAsyncThunk('candidates/deleteCandidates', async (candidate_id:number) => {
    const { error } = await supabase.from('candidates').delete().eq("candidate_id", candidate_id);
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
                    state.Candidate = state.Candidate.filter((Candidate) => Candidate.candidate_id !== action.payload.toString());
                });

    }
})
export default CandidateSlice.reducer;
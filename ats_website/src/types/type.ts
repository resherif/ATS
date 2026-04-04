export type Job = {
    id: string,
    title: string,
    Department: string,
    location: string,
    employment_type: string,
    status: "Draft" | "published",
    requirements: string,
    Job_Description: string,
    Experience_Level: string,
    salary_range: number,
    posted_at: string
};
export interface Candidates{
   candidate_id: number,
    candidate_name: string,
    email: string,
    created_at: Date,
    skills:{
        skill_name: string,
        skill_id:number
    }[],
    application_id: number,
    job_id: number,
    status: "Pending" | "Screening" | "Interviewing" | "Hired" | "Rejected"; 
    applied_at: string,
    resume_url: string,
    role:string,
}
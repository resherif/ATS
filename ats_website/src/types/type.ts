export type Job = {
    id: number;                          // SERIAL → number مش string
    job_title: string;                   // كان title
    description: string;                 // كان Job_Description
    status: "published" | "draft";
    requirements: string;
    experience_level: string;            // كان Experience_Level
    salary_range: string;                // كان number → بقى VARCHAR '8000-12000 EGP'
    location: string;       
    employment_type: string;
    department: string;                  // كان Department
    posted_date: string;                 // كان posted_at
};
export interface Candidates{
   candidate_id: string,
    candidate_name: string,
    email: string,
    created_at: string,
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
export type Application = {
    application_id: number;
    candidate_id: number;
    job_id: number;
    status: "Pending" | "Screening" | "Interviewing" | "Hired" | "Rejected";
    applied_at: string;
    resume_url: string;
}
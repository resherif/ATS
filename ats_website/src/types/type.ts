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

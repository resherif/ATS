// import { supabase } from '../utils/supabaseClient';
// import { Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// type JobForm = {
//     id: string,
//     title: string,
//     Department: string,
//     location: string,
//     employment_type: string,
//     status: "Draft" | "published",
//     requirements: string,
//     Job_Description: string,
//     Experience_Level: string,
//     salary_range: number,
//     posted_at: Date
// }
// const Jobs = () => {
//     const [jobList, setJobList] = useState<JobForm[]>([]);
//     useEffect(() => {
//         fetchJobs();
//     }, [])
//     const fetchJobs = async () => {
//         const { data, error } = await supabase.from("jobs").select("*");
//         if (error) {
//             console.log("error fetching jobs", error);
//         }
//         setJobList(data || []);
//     }
//     return (
//         <>
//             <Link to='/jobs/AddJobs' className='bg-[#2D68C4] p-3 mb-5 border-r-4 text-white border-none fit-content'> Add New job</Link>

//             <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
//                 <table className='border w-3xl text-center pb-3 mb-3'>
//                     <thead  className=''>
//                          <th>title</th>
//                     <th>location</th>
//                     <th>salary</th>
//                     <th>status</th>
//                     <th>posted_at</th>
//                    </thead>
//                     <tbody>
//                         {
//                             jobList.map((job) => (
//                                 <tr key={job.id}>
//                                     <td>{job.title}</td>
//                                     <td>{job.location}</td>
//                                     <td>{job.salary_range}</td>
//                                     <td>{job.status}</td>
//                                     <td>{new Date(job.posted_at).toLocaleDateString()}</td>
//                                 </tr>
//                             ))
//                         }
//                     </tbody>
//                 </table>
//             </div>
//         </>

//     );
// };

// export default Jobs
import { supabase } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

type JobForm = {
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
    posted_at: string // يفضل string إذا كان قادماً من DB مباشرة
}

const Jobs = () => {
    const [jobList, setJobList] = useState<JobForm[]>([]);

    useEffect(() => {
        fetchJobs();
    }, [])

    const fetchJobs = async () => {
        const { data, error } = await supabase.from("jobs").select("*");
        if (error) {
            console.log("error fetching jobs", error);
        }
        setJobList(data || []);
    }

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (confirmDelete) {
            const { error } = await supabase.from("jobs").delete().eq("id", id);
            if (error) {
                console.log("Error deleting job!", error);
            } else {
                setJobList(jobList.filter((job) => job.id !== id))
            }
        }
    }
    return (
        <div className="p-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-slate-800">Jobs Management</h2>
                <Link
                    to='/jobs/AddJobs'
                    className='bg-[#2D68C4] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm font-medium flex items-center gap-2'
                >
                    <span className="text-xl">+</span> Add New Job
                </Link>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Job Title</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Salary</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Posted At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {jobList.length > 0 ? (
                            jobList.map((job) => (
                                <tr key={job.id} className="hover:bg-slate-50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-slate-700 font-medium">{job.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.location === 'Remote' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {job.location}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {job.salary_range > 0 ? `$${job.salary_range.toLocaleString()}` : "Not Disclosed"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'published' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {job.status || 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : '---'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            {/* زر التعديل - يوجه لصفحة الـ Edit مع تمرير الـ ID */}
                                            <Link
                                                to={`/jobs/AddJobs/${job.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition-all"
                                            >
                                                Edit
                                            </Link>

                                            {/* زر الحذف */}
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-200 px-3 py-1 rounded-md hover:bg-red-50 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                                    No jobs found. Start by adding a new one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Jobs;
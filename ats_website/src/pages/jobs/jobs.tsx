import { Link } from 'react-router-dom';
import { fetchJobs, deleteJob } from '../../store/jobSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useEffect } from 'react';
const Jobs = () => {
    const dispatch = useAppDispatch();
    const { Jobs, loading } = useAppSelector((state) => state.jobs)

    useEffect(() => {
        dispatch(fetchJobs());
    }, [dispatch]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure')) {
            dispatch(deleteJob(id));
        }
    }
    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-slate-800">Jobs Management</h2>
                <Link
                    to='/jobs/AddJobs'
                    className='bg-[#2D68C4] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors duration-200 shadow-sm font-medium flex items-center gap-2'
                >
                    <span className="text-xl">+</span> Add New Job
                </Link>
            </div>


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
                        {Jobs.length > 0 ? (
                            Jobs.map((job) => (
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

                                            <Link
                                                to={`/jobs/AddJobs/${job.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition-all"
                                            >
                                                Edit
                                            </Link>


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
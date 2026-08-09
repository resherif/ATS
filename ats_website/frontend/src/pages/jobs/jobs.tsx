import { Link } from 'react-router-dom';
import { fetchJobs, deleteJob } from '../../store/jobSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useEffect, useState } from 'react';
import { applyToJob } from '../../store/ApplicationSlice';

const Jobs = () => {
    const dispatch = useAppDispatch();
    const { Jobs, loading, error, totalCount } = useAppSelector((state) => state.jobs);

    // State للتحكم في الـ Pagination
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;

    const handleApply = (jobId: number) => {
        const dummyCandidateId = 1; 
        dispatch(applyToJob({ candidate_id: dummyCandidateId, job_id: jobId }));
    };  

    // تمرير الـ Pagination parameters المطلوبة لـ fetchJobs
    useEffect(() => {
        dispatch(fetchJobs({ pageIndex, pageSize }));
    }, [dispatch, pageIndex]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-slate-400">Loading jobs...</p>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-64">
            <p className="text-red-400">Error: {error}</p>
        </div>
    );

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            dispatch(deleteJob(id));
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">Jobs Management</h2>
                <Link
                    to='/jobs/AddJobs'
                    className='self-start sm:self-auto bg-[#2D68C4] hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-colors duration-200 shadow-sm font-medium flex items-center gap-2 text-sm'
                >
                    <span className="text-lg">+</span> Add New Job
                </Link>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Job Title</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Salary</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Posted At</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {Jobs && Jobs.length > 0 ? (
                            Jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-700 font-medium">{job.job_title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.location === 'Remote' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {job.location}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {job.salary_range || "Not Disclosed"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'published' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {job.status || 'draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : '---'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 items-center">
                                            <button
                                                onClick={() => handleApply(job.id)}
                                                className="text-emerald-600 hover:text-emerald-800 text-sm border border-emerald-200 px-3 py-1 rounded-md hover:bg-emerald-50 transition-all"
                                            >
                                                Apply
                                            </button>
                                            <Link
                                                to={`/jobs/AddJobs/${job.id}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50 transition-all"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(job.id)}
                                                className="text-red-600 hover:text-red-800 text-sm border border-red-200 px-3 py-1 rounded-md hover:bg-red-50 transition-all"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                                    No jobs found. Start by adding a new one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 sm:hidden">
                {Jobs && Jobs.length > 0 ? Jobs.map((job) => (
                    <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="font-semibold text-slate-800">{job.job_title}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : '---'}
                                </p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.status === 'published' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                {job.status || 'draft'}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.location === 'Remote' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {job.location}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                {job.salary_range || "Not Disclosed"}
                            </span>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                            <button
                                onClick={() => handleApply(job.id)}
                                className="flex-1 text-center text-emerald-600 text-sm border border-emerald-200 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-all"
                            >
                                Apply
                            </button>
                            <Link
                                to={`/jobs/AddJobs/${job.id}`}
                                className="flex-1 text-center text-blue-600 text-sm border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-all"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(job.id)}
                                className="flex-1 text-red-600 text-sm border border-red-200 px-3 py-1.5 rounded-md hover:bg-red-50 transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-slate-400 py-10">No jobs found.</p>
                )}
            </div>

            {/* Simple Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-2 mt-4">
                    <button
                        disabled={pageIndex === 0}
                        onClick={() => setPageIndex((prev) => prev - 1)}
                        className="px-3 py-1 text-sm border border-slate-300 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-600">
                        Page {pageIndex + 1} of {totalPages}
                    </span>
                    <button
                        disabled={pageIndex + 1 >= totalPages}
                        onClick={() => setPageIndex((prev) => prev + 1)}
                        className="px-3 py-1 text-sm border border-slate-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Jobs;
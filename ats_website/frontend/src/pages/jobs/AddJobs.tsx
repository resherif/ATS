import { useForm, type SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { Job } from '../../types/type';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { fetchJobs, fetchJobById, clearSelectedJob } from '../../store/jobSlice';
import { api } from '../../utils/api';

const AddJobs = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const dispatch = useAppDispatch();

    const { selectedJob, profileLoading } = useAppSelector((state) => state.jobs);

    const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<Job>({
        defaultValues: {
            status: "draft",
            location: "On-site"
        }
    });

    // 1. Fetch job details using Redux thunk if editing
    useEffect(() => {
        if (isEditMode && id) {
            dispatch(fetchJobById(id));
        }

        return () => {
            dispatch(clearSelectedJob());
        };
    }, [id, isEditMode, dispatch]);

    // 2. Populate form when selectedJob changes
    useEffect(() => {
        if (isEditMode && selectedJob) {
            reset({
                job_title: selectedJob.job_title,
                department: selectedJob.department,
                location: selectedJob.location,
                employment_type: selectedJob.employment_type,
                status: selectedJob.status,
                requirements: selectedJob.requirements,
                description: selectedJob.description,
                experience_level: selectedJob.experience_level,
                salary_range: selectedJob.salary_range,
            });
        }
    }, [selectedJob, isEditMode, reset]);

    // 3. Handle Create / Update via Express API
    const onSubmit: SubmitHandler<Job> = async (data) => {
        try {
            if (isEditMode && id) {
                await api.put(`/jobs/${id}`, data);
                alert('Job updated successfully!');
            } else {
                await api.post('/jobs', data);
                alert("Job Created Successfully!");
            }
            // Refetch default page and redirect
            dispatch(fetchJobs({ pageIndex: 0, pageSize: 10 }));
            navigate('/jobs');
        } catch (err: any) {
            setError("root", {
                message: err.response?.data?.message || "Something went wrong while saving the job."
            });
        }
    };

    if (isEditMode && profileLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-slate-400">Loading job details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="w-35 mb-5 text-center bg-[#2D68C4] text-white px-5 py-1 rounded-lg shadow-sm font-medium">
                {isEditMode ? "Edit job" : "Add job"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Job Title</label>
                    <input
                        {...register("job_title", { required: "Job title is required" })}
                        className={`p-2 border rounded ${errors.job_title ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g. Frontend Developer"
                    />
                    {errors.job_title && <span className="text-red-500 text-sm">{errors.job_title.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Department</label>
                    <select {...register("department")} className="p-2 border border-gray-300 rounded">
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Location</label>
                    <select {...register("location")} className="p-2 border border-gray-300 rounded">
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Employment Type</label>
                    <select {...register("employment_type")} className="p-2 border border-gray-300 rounded">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Experience Level</label>
                    <select {...register("experience_level")} className="p-2 border border-gray-300 rounded">
                        <option value="Junior">Junior</option>
                        <option value="Mid">Mid-Level</option>
                        <option value="Senior">Senior</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Salary (Monthly)</label>
                    <input
                        type="text"
                        {...register("salary_range")}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="e.g. $1500 - $2000"
                    />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-semibold text-gray-700">Job Description</label>
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        className="p-2 border border-gray-300 rounded h-32"
                        placeholder="Describe the role..."
                    />
                    {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-semibold text-gray-700">Requirements</label>
                    <textarea
                        {...register("requirements")}
                        className="p-2 border border-gray-300 rounded h-24"
                        placeholder="List skills, tools, etc."
                    />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <label className="font-semibold">Status:</label>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="draft" {...register("status")} /> Draft
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="published" {...register("status")} /> Publish
                        </label>
                    </div>
                    <button
                        disabled={isSubmitting}
                        type='submit'
                        className={`w-full sm:w-auto px-6 py-2 rounded text-white font-bold transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isSubmitting ? "Processing..." : isEditMode ? "Update Job" : "Create Job"}
                    </button>
                </div>

                {errors.root && <p className="text-red-500 text-center md:col-span-2">{errors.root.message}</p>}
            </form>
        </div>
    );
};

export default AddJobs;
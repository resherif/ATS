import { useForm, type SubmitHandler } from 'react-hook-form';
import { supabase } from '../../utils/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { Job } from '../../types/type';
import { useDispatch } from 'react-redux';
import { fetchJobs } from '../../store/jobSlice';
import type { AppDispatch } from '../../store/store';
const AddJobs = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const dispatch = useDispatch<AppDispatch>();
    const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<Job>({
        defaultValues: {
            status: "draft",
            location: "on-site"
        }
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchJobDetails = async () => {
                const { data } = await supabase.from('jobs').select('*').eq('id', id).single();
                if (data) {
                    reset({
                        job_title: data.job_title,
                        department: data.department,
                        location: data.location,
                        employment_type: data.employment_type,
                        status: data.status,
                        requirements: data.requirements,
                        description: data.description,
                        experience_level: data.experience_level,
                        salary_range: data.salary_range,
                    });
                }
            };
            fetchJobDetails();
        }
    }, [id, isEditMode, reset]);
    const onSubmit: SubmitHandler<Job> = async (data) => {
        try {
            if (isEditMode) {
                const { error } = await supabase.from('jobs').update({
                    job_title: data.job_title,
                    description: data.description,
                    department: data.department,
                    location: data.location,
                    employment_type: data.employment_type,
                    status: data.status,
                    requirements: data.requirements,
                    experience_level: data.experience_level,
                    salary_range: data.salary_range,
                }).eq('id', id);
                if (error) throw error;
                dispatch(fetchJobs());
                alert('job updated succesfully!');
                navigate('/jobs');
            } else {
                const { error } = await supabase.from('jobs').insert({
                    job_title: data.job_title,
                    description: data.description,
                    department: data.department,
                    location: data.location,
                    employment_type: data.employment_type,
                    status: data.status,
                    requirements: data.requirements,
                    experience_level: data.experience_level,
                    salary_range: data.salary_range,
                }).select();
                if (error) throw error;
                dispatch(fetchJobs());
                alert("Job Created Succesfully!");
                navigate('/jobs');
            }
        } catch (error) {
            setError("root", {
                message: "Something went wrong while creating the job."
            })

        }
    }
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="w-35 mb-5 text-center bg-[#2D68C4] hover:bg-blue-700 text-white  px-5 py-1 rounded-lg transition-colors duration-200 shadow-sm font-medium ">{isEditMode ? "Edit job" : "Add job"}</h2>
            <form action='' onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        type="number"
                        {...register("salary_range", { valueAsNumber: false })}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="e.g. 15000"
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
                        <label className="flex items-center gap-1">
                            <input type="radio" value="Draft" {...register("status")} /> Draft
                        </label>
                        <label className="flex items-center gap-1">
                            <input type="radio" value="published" {...register("status")} /> Publish
                        </label>
                    </div>
                    <button
                        disabled={isSubmitting}
                        type='submit'
                        className={`w-full sm:w-auto px-6 py-2 rounded text-white font-bold ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transition'}`}
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

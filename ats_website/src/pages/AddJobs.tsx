
import { useForm, type SubmitHandler } from 'react-hook-form';
import { supabase } from '../utils/supabaseClient';
type JobForm = {
    title: string,
    Department: string,
    location: string,
    employment_type: string,
    status: "Draft" | "published",
    requirements: string,
    Job_Description: string,
    Experience_Level: string,
    salary_range: Number,
    posted_at: Date
}
const AddJobs = () => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<JobForm>({
        defaultValues: {
           status: "Draft",
            location: "on-site"
        }
    });
    const onSubmit: SubmitHandler<JobForm> = async (data) => {
        try {
            const { data: insertedData, error } = await supabase.from('jobs').insert([{
                title: data.title,
                description: data.Job_Description,
                department: data.Department,
                location: data.location,
                employment_type: data.employment_type,
                Status: data.status,
                requirements: data.requirements,
                experience_level: data.Experience_Level,
                salary_range: data.salary_range
            }]).select();
            if (error) {
                throw error;
            }
            alert("Job Created Succesfully!");
            console.log(insertedData);
            ;
        } catch (error) {
            setError("root", {
                message: "Something went wrong while creating the job."
            })
        }
    }
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">

            <form action='' onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Job Title</label>
                    <input
                        {...register("title", { required: "Title is required" })}
                        className={`p-2 border rounded ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g. Frontend Developer"
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Department</label>
                    <select {...register("Department")} className="p-2 border border-gray-300 rounded">
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
                    <select {...register("Experience_Level")} className="p-2 border border-gray-300 rounded">
                        <option value="Junior">Junior</option>
                        <option value="Mid">Mid-Level</option>
                        <option value="Senior">Senior</option>
                    </select>
                </div>


                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-gray-700">Salary (Monthly)</label>
                    <input
                        type="number"
                        {...register("salary_range", { valueAsNumber: true })}
                        className="p-2 border border-gray-300 rounded"
                        placeholder="e.g. 15000"
                    />
                </div>


                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-semibold text-gray-700">Job Description</label>
                    <textarea
                        {...register("Job_Description", { required: "Description is required" })}
                        className="p-2 border border-gray-300 rounded h-32"
                        placeholder="Describe the role..."
                    />
                    {errors.Job_Description && <span className="text-red-500 text-sm">{errors.Job_Description.message}</span>}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-semibold text-gray-700">Requirements</label>
                    <textarea
                        {...register("requirements")}
                        className="p-2 border border-gray-300 rounded h-24"
                        placeholder="List skills, tools, etc."
                    />
                </div>

                <div className="md:col-span-2 flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
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
                        className={`px-6 py-2 rounded text-white font-bold ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transition'}`}
                    >
                        {isSubmitting ? "Processing..." : "Create Job"}
                    </button>
                </div>

                {errors.root && <p className="text-red-500 text-center md:col-span-2">{errors.root.message}</p>}
            </form>
        </div>
    );
};

export default AddJobs;
// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { supabase } from '../utils/supabaseClient';

// const AddNewJob = () => {
//     const { id } = useParams(); // يجلب الـ id من الرابط إذا كان موجوداً
//     const navigate = useNavigate();
//     const isEditMode = Boolean(id); // إذا وجد id فنحن في وضع التعديل

//     const [formData, setFormData] = useState({
//         title: '',
//         location: '',
//         salary_range: 0,
//         // باقي الحقول...
//     });

//     // 1. إذا كان تعديل، نجلب بيانات الوظيفة القديمة ونضعها في الـ Form
//     useEffect(() => {
//         if (isEditMode) {
//             const fetchJobDetails = async () => {
//                 const { data, error } = await supabase
//                     .from('jobs')
//                     .select('*')
//                     .eq('id', id)
//                     .single();
                
//                 if (data) setFormData(data);
//             };
//             fetchJobDetails();
//         }
//     }, [id, isEditMode]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (isEditMode) {
//             // منطق التحديث (Update)
//             const { error } = await supabase
//                 .from('jobs')
//                 .update(formData)
//                 .eq('id', id);
            
//             if (!error) navigate('/jobs');
//         } else {
//             // منطق الإضافة (Insert)
//             const { error } = await supabase
//                 .from('jobs')
//                 .insert([formData]);
            
//             if (!error) navigate('/jobs');
//         }
//     };

//     return (
//         <div>
//             <h2>{isEditMode ? 'Edit Job' : 'Add New Job'}</h2>
//             <form onSubmit={handleSubmit}>
//                 {/* Inputs مربوطة بـ formData */}
//                 <input 
//                     value={formData.title} 
//                     onChange={(e) => setFormData({...formData, title: e.target.value})} 
//                 />
//                 <button type="submit" className="bg-[#2D68C4] text-white">
//                     {isEditMode ? 'Update Job' : 'Save Job'}
//                 </button>
//             </form>
//         </div>
//     );
// };
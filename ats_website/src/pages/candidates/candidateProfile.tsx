import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCandidateById, clearSelectedCandidate } from '../../store/CandidateSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { ArrowLeft, Mail, Briefcase, CalendarDays, FileText } from 'lucide-react';
const statusColors: Record<string, string> = {
    Hired: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Interviewing: "bg-blue-100 text-blue-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Screening: "bg-purple-100 text-purple-700",
};
const CandidateProfile = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { selectedCandidate: c, profileLoading, error } = useAppSelector(s => s.Candidate);
    useEffect(() => {
        if (id) dispatch(fetchCandidateById(id));
        return () => { dispatch(clearSelectedCandidate()); };
    }, [id, dispatch]);
    if (profileLoading) {
        return (
            <div className='p-6 text-center text-gray-400 '>loading Candidate...</div>
        )
    }
    if (error || !c) {
        return (
            <div className="p-6 text-center text-red-500">
                {error ?? 'Candidate not found.'}
            </div>
        );
    }
    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-5"
            >
                <ArrowLeft size={16} /> Back to candidates
            </button>
            <div className="bg-white rounded-2xl shadow p-5 mb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{c.candidate_name}</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{c.role}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {c.status}
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Mail size={15} className="text-gray-400" />
                        <a href={`mailto:${c.email}`} className="hover:text-blue-600">{c.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase size={15} className="text-gray-400" />
                        <span>Job #{c.job_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarDays size={15} className="text-gray-400" />
                        <span>Applied {new Date(c.applied_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText size={15} className="text-gray-400" />
                            <a
                        href={c.resume_url}
                        target="_blank"
                        className="text-blue-600 hover:underline font-medium"
                        >
                        View resume
                    </a>
                </div>
            </div>
        </div>
  {
        c.skills?.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {c.skills.map(skill => (
                        <span
                            key={skill.skill_id}
                            className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
                        >
                            {skill.skill_name}
                        </span>
                    ))}
                </div>
            </div>
        )
    }
         </div >
    )
}

export default CandidateProfile
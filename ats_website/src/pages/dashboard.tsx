import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchCandidates } from '../store/CandidateSlice';
import { fetchJobs } from '../store/jobSlice';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
    Hired: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Interviewing: 'bg-purple-100 text-purple-700',
    Screening: 'bg-amber-100 text-amber-700',
    Applied: 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
};

const HomePage = () => {
    const dispatch = useAppDispatch();
    const { Candidate } = useAppSelector((state) => state.Candidate);
    const { Jobs } = useAppSelector((state) => state.jobs);

    useEffect(() => {
        dispatch(fetchCandidates());
        dispatch(fetchJobs());
    }, [dispatch]);

    const totalCandidates = Candidate.length;
    const hired = Candidate.filter(c => c.status === 'Hired').length;
    const interviewing = Candidate.filter(c => c.status === 'Interviewing').length;
    const screening = Candidate.filter(c => c.status === 'Screening').length;
    const pending = Candidate.filter(c => c.status === 'Pending').length;
    const applied = totalCandidates - hired - interviewing - screening - pending;
    const openJobs = Jobs.filter(j => j.status === 'published').length;

    const recentCandidates = [...Candidate]
        .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
        .slice(0, 5);

    const recentJobs = Jobs.slice(0, 5);

    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="flex items-start justify-between mb-6 gap-3">
                <div>
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Good morning, HR Team 👋</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Here's what's happening with your hiring pipeline today.</p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-medium bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Live
                </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                    { label: 'Open Positions', value: openJobs, color: 'blue', trend: 'updated' },
                    { label: 'Total Candidates', value: totalCandidates, color: 'purple', trend: 'all time' },
                    { label: 'Hired', value: hired, color: 'green', trend: 'great progress' },
                    { label: 'Pending Review', value: pending, color: 'amber', trend: 'needs action' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 relative overflow-hidden">
                        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-2 sm:mb-3 text-sm
                            ${stat.color === 'blue' ? 'bg-blue-50   text-blue-700' : ''}
                            ${stat.color === 'purple' ? 'bg-purple-50 text-purple-700' : ''}
                            ${stat.color === 'green' ? 'bg-green-50  text-green-700' : ''}
                            ${stat.color === 'amber' ? 'bg-amber-50  text-amber-700' : ''}
                        `} />
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1 leading-tight">{stat.label}</div>
                        <div className={`text-xs mt-1.5 font-medium
                            ${stat.color === 'amber' ? 'text-red-500' : 'text-green-600'}
                        `}>{stat.trend}</div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl
                            ${stat.color === 'blue' ? 'bg-gradient-to-r from-blue-500   to-blue-300' : ''}
                            ${stat.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-300' : ''}
                            ${stat.color === 'green' ? 'bg-gradient-to-r from-green-500  to-green-300' : ''}
                            ${stat.color === 'amber' ? 'bg-gradient-to-r from-amber-500  to-amber-300' : ''}
                        `} />
                    </div>
                ))}
            </div>

            {/* Pipeline */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                    { label: 'Applied', value: applied, total: totalCandidates, bg: 'bg-blue-50', text: 'text-blue-800', sub: 'text-blue-600', bar: 'bg-blue-400' },
                    { label: 'Screening', value: screening, total: totalCandidates, bg: 'bg-amber-50', text: 'text-amber-800', sub: 'text-amber-600', bar: 'bg-amber-400' },
                    { label: 'Interviewing', value: interviewing, total: totalCandidates, bg: 'bg-purple-50', text: 'text-purple-800', sub: 'text-purple-600', bar: 'bg-purple-400' },
                    { label: 'Hired', value: hired, total: totalCandidates, bg: 'bg-green-50', text: 'text-green-800', sub: 'text-green-600', bar: 'bg-green-400' },
                ].map((stage) => (
                    <div key={stage.label} className={`${stage.bg} rounded-xl p-3 sm:p-4`}>
                        <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${stage.sub}`}>{stage.label}</div>
                        <div className={`text-xl sm:text-2xl font-bold ${stage.text}`}>{stage.value}</div>
                        <div className={`text-xs mt-1 ${stage.sub}`}>candidates</div>
                        <div className="mt-2 h-1 bg-black/10 rounded-full">
                            <div
                                className={`h-1 rounded-full ${stage.bar}`}
                                style={{ width: `${stage.total ? Math.round((stage.value / stage.total) * 100) : 0}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Recent Candidates + Open Jobs — كلهم جوه grid واحدة */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                {/* Candidates */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-900">Recent Candidates</h2>
                        <Link to="/Candidates" className="text-xs text-blue-500 font-medium hover:underline">See all</Link>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['Name', 'Position', 'Status', 'Applied'].map(h => (
                                        <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentCandidates.map((c, i) => (
                                    <tr key={i} className="border-t border-gray-50">
                                        <td className="py-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    {getInitials(c.candidate_name)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{c.candidate_name}</div>
                                                    <div className="text-xs text-gray-400">{c.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2.5 text-sm text-gray-600">{c.role}</td>
                                        <td className="py-2.5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="py-2.5 text-xs text-gray-400">
                                            {new Date(c.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="flex flex-col gap-2 sm:hidden">
                        {recentCandidates.map((c, i) => (
                            <div key={i} className="flex items-center justify-between py-2.5 border-t border-gray-50 first:border-none first:pt-0">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {getInitials(c.candidate_name)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{c.candidate_name}</div>
                                        <div className="text-xs text-gray-400 truncate">{c.role}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {c.status}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(c.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ✅ Open Jobs — جوه الـgrid */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-900">Open Jobs</h2>
                        <Link to="/Jobs" className="text-xs text-blue-500 font-medium hover:underline">See all</Link>
                    </div>
                    <div>
                        {recentJobs.map((job, i) => {
                            const colors = ['bg-blue-400', 'bg-purple-400', 'bg-amber-400', 'bg-green-400', 'bg-pink-400'];
                            const applicantCount = Candidate.filter(c => c.job_id.toString() === job.id).length;
                            return (
                                <div key={i} className="flex items-center justify-between py-2.5 border-t border-gray-50 first:border-none first:pt-0">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[i % colors.length]}`} />
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">{job.title}</div>
                                            <div className="text-xs text-gray-400">{job.Department ?? 'General'}</div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <div className="text-sm font-semibold text-gray-900">{applicantCount}</div>
                                        <div className="text-xs text-gray-400">applicants</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default HomePage;
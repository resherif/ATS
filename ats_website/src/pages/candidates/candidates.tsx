import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,

} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { columns }
    from './columns'
import { fetchCandidates, deleteCandidates } from '../../store/CandidateSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
const CandidatesPage = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { Candidate, loading, totalCount } = useAppSelector((state) => state.Candidate)
    const pageCount = Math.ceil(totalCount / pageSize);
    useEffect(() => {
        dispatch(fetchCandidates({ pageIndex, pageSize }));
    }, [dispatch, pageIndex, pageSize]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure')) {
            await dispatch(deleteCandidates(id));
        }
        if (Candidate.length === 1 && pageIndex > 0) {
            setPageIndex(prev => prev - 1);
        } else {
            dispatch(fetchCandidates({ pageIndex, pageSize }));
        }
    }
    const table = useReactTable({
        data: Candidate,
        columns,
        state: {
            sorting,
           
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount,
        meta: {
            onDelete: handleDelete
        }
    });
    const pages = Array.from({ length: pageCount }, (_, i) => i);
    return (
        <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Candidates List</h1>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="p-3 border-b font-semibold text-gray-600">
                                        {header.column.getCanSort() ? (
                                            <button
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="flex items-center gap-1 hover:text-gray-900"
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <ChevronUp size={14} />,
                                                    desc: <ChevronDown size={14} />,
                                                }[header.column.getIsSorted() as string] ?? (
                                                    <ChevronsUpDown size={14} className="text-gray-400" />
                                                )}
                                            </button>
                                        ) : (
                                            flexRender(header.column.columnDef.header, header.getContext())
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-6 text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/candidates/${row.original.candidate_id}`)}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="p-3 border-b"
                                            // Stop row click from triggering on Delete button
                                            onClick={cell.column.id === 'actions' ? e => e.stopPropagation() : undefined}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 sm:hidden">
                {loading ? (
                    <p className="text-center text-gray-400 py-6">Loading...</p>
                ) : (
                    table.getRowModel().rows.map(row => {
                        const c = row.original;
                        return (
                            <div
                                key={row.id}
                                className="border border-gray-100 rounded-xl p-4 shadow-sm cursor-pointer"
                                onClick={() => navigate(`/candidates/${c.candidate_id}`)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-900">{c.candidate_name}</p>
                                        <p className="text-xs text-gray-400">{c.role}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${{
                                        Hired: "bg-green-100 text-green-700",
                                        Rejected: "bg-red-100 text-red-700",
                                        Interviewing: "bg-blue-100 text-blue-700",
                                        Pending: "bg-yellow-100 text-yellow-700",
                                        Screening: "bg-purple-100 text-purple-700",
                                    }[c.status] ?? 'bg-gray-100 text-gray-600'}`}>
                                        {c.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
                                    <span className="text-xs text-gray-400">
                                        {new Date(c.applied_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-3" onClick={e => e.stopPropagation()}>
                                        <a href={c.resume_url} target="_blank" className="text-blue-600 text-xs font-medium hover:underline">
                                            Resume
                                        </a>
                                        <button
                                            onClick={() => handleDelete(c.candidate_id)}
                                            className="text-red-600 text-xs font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                <span className="text-sm text-gray-600">
                    Page {pageIndex + 1} of {pageCount || 1}
                    <span className="text-gray-400 ml-2">({totalCount} total)</span>
                </span>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <button
                        onClick={() => setPageIndex(prev => prev - 1)}
                        disabled={pageIndex === 0}
                        className="px-3 py-1 text-sm rounded border disabled:opacity-40 hover:bg-gray-50"
                    >
                        Prev
                    </button>
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => setPageIndex(page)}
                            className={`px-3 py-1 text-sm rounded border ${
                                pageIndex === page
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            {page + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setPageIndex(prev => prev + 1)}
                        disabled={pageIndex >= pageCount - 1}
                        className="px-3 py-1 text-sm rounded border disabled:opacity-40 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>

                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                        setPageIndex(0);
                    }}
                    className="text-sm border rounded px-2 py-1"
                >
                    {[5, 10, 20].map(size => (
                        <option key={size} value={size}>Show {size}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
export default CandidatesPage;


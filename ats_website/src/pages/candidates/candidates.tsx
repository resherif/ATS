import  { useEffect} from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,

} from '@tanstack/react-table';
import { columns }
    from './columns'
import { fetchCandidates, deleteCandidates } from '../../store/CandidateSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

const CandidatesPage = () => {
    const dispatch = useAppDispatch();
    const { Candidate, loading } = useAppSelector((state) => state.Candidate)

    useEffect(() => {
        dispatch(fetchCandidates());
    }, [dispatch]);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure')) {
            dispatch(deleteCandidates(id));
        }
    }
    const table = useReactTable({
        data: Candidate,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Candidates List</h1>

            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="p-3 border-b font-semibold text-gray-600">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="p-3 border-b">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default CandidatesPage;
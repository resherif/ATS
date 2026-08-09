import type { ColumnDef } from "@tanstack/react-table";
import type { Application } from "../../types/type";

export const columns: ColumnDef<Application>[] = [
    {
        accessorKey: "candidate_id",
        header: 'Candidate ID',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="font-medium text-gray-900">
                {row.getValue("candidate_id")}
            </div>
        ),
    },
    {
        accessorKey: "job_id",
        header: 'Job ID',
        enableSorting: false,
        cell: ({ row }) => (
            <div className="font-medium text-gray-900">
                {row.getValue("job_id")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: 'Status',
        enableSorting: true,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const colors: Record<string, string> = {
                Hired: "bg-green-100 text-green-700",
                Rejected: "bg-red-100 text-red-700",
                Interviewing: "bg-blue-100 text-blue-700",
                Screening: "bg-purple-100 text-purple-700",
                Pending: "bg-yellow-100 text-yellow-700",
            };
            return (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {status}
                </span>
            );
        }
    },
    {
        accessorKey: "applied_at",
        header: "Date Applied",
        enableSorting: true,
        cell: ({ row }) => new Date(row.getValue("applied_at")).toLocaleDateString(),
    },
    {
        accessorKey: "resume_url",
        header: "Resume",
        enableSorting: false,
        cell: ({ row }) => (
            <a
                href={row.getValue("resume_url")}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline font-medium"
            >
                View PDF
            </a>
        ),
    },
    {
        id: "actions", // 👈 تم تغيير هذه الخصيصة إلى id بدلاً من accessorKey ليتطابق مع الـ stopPropagation في الجدول
        header: "Actions",
        enableSorting: false,
        cell: ({ row, table }) => {
            const application_id = row.original.application_id;
            return (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        (table.options.meta as any)?.onDelete(application_id);
                    }}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                    Delete
                </button>
            );
        }
    }
];
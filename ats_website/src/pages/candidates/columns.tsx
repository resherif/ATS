import type { ColumnDef } from "@tanstack/react-table";
import type { Candidates } from "../../types/type";
export const columns: ColumnDef<Candidates>[] = [
    {
        accessorKey: "candidate_name",
        header: 'candidate_name',
        enableSorting: false,
        cell: ({ row }) => <div className="font-medium text-gray-900  ">
            {row.getValue("candidate_name")}

        </div>,

    },
    {
        accessorKey: 'role',
        header: 'Position',
        enableSorting: false,
    },
    {
        accessorKey: "status",
        header: 'status',
          enableSorting: true,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const colors: Record<string, string> = {
                Hired: "bg-green-100 text-green-700",
                Rejected: "bg-red-100 text-red-700",
                Interviewing: "bg-blue-100 text-blue-700",
                Pending: "bg-yellow-100 text-yellow-700",
            };
            return (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
                    {status}
                </span>
            );
        }
    },
    {
        accessorKey: "applied_at",
          enableSorting: true,
        header: "Date Applied",
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
                className="text-blue-600 hover:underline font-medium"
            >
                View PDF
            </a>
        ),
    }, {
        id: 'actions',
        header: "Actions",
          enableSorting: false,
        cell: ({ row, table }) => {
            const candidateId = row.original.candidate_id;
        return (
            <button 
                onClick={() => (table.options.meta as any)?.onDelete(candidateId)}
                className="text-red-600 hover:text-red-800 font-medium"
             >
                Delete
            </button>
        );
        }
    }
]
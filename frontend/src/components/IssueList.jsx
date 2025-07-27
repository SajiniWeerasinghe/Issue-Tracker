import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import IssueListHeader from "./IssueListHeader";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";





const IssueList = () => {
    const [issues, setIssues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const { user } = useAuth();

    useEffect(() => {
        axios
            .get(API_ENDPOINTS.ISSUES)
            .then((res) => setIssues(res.data))
            .catch((err) => console.error(err));
    }, []);



    const handleDelete = async (issueId) => {
        if (window.confirm("Are you sure you want to delete this issue?")) {
            try {
                await axios.delete(API_ENDPOINTS.ISSUE(issueId));
                setIssues((prev) => prev.filter((issue) => issue._id !== issueId)); // Remove from UI
            } catch (err) {
                console.error("Error deleting issue:", err);
            }
        }
    };


    const navigate = useNavigate();

    const handleCreateIssue = () => {
        navigate('/create'); // navigate to IssueCreate page
    };

    // filter
    const filteredIssues = issues.filter((issue) => {
        const matchesSearch = issue.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ||
            issue.status.toLowerCase() === statusFilter.toLowerCase();

        const matchesPriority =
            priorityFilter === "all" ||
            issue.priority.toLowerCase() === priorityFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <>
            <IssueListHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
            />
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-left">
                    Issues ({issues.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIssues.map((issue) => (
                        <div key={issue._id} className="bg-gray-50 rounded-md shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all group flex flex-col justify-between">
                            <div className="flex-1 min-w-0">
                                {/* Title */}
                                <div className="flex justify-between items-start">
                                    <Link to={`/issues/${issue._id}`} className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-blue-600 line-clamp-2">
                                            {issue.title}
                                        </h3>
                                    </Link>
                                    {/* Edit/Delete buttons */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* Edit button - show for authenticated users */}
                                        {user && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/issues/edit/${issue._id}`);
                                                }}
                                                className="h-7 w-7 p-0 flex items-center justify-center text-gray-500 hover:text-blue-600 cursor-pointer"
                                                title="Edit issue"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        )}

                                        {/* Delete button - only show for issue creator or admin */}
                                        {user && (issue.createdBy?._id === user._id || user.role === 'admin') && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(issue._id);  // Pass ID here
                                                }}
                                                className="h-7 w-7 p-0 flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer"
                                                title="Delete issue"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <Link to={`/issues/${issue._id}`} className="block">
                                    {/* Description */}
                                    {issue.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {issue.description}
                                        </p>
                                    )}

                                    {/* Status + Priority */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span
                                            className={`text-xs px-3 py-1 rounded-full font-medium
                  ${issue.status === "Open" && "bg-yellow-300 text-white"}
                  ${issue.status === "In Progress" && "bg-blue-400 text-white"}
                  ${issue.status === "Testing" && "bg-purple-400 text-white"}
                  ${issue.status === "Resolved" && "bg-green-400 text-white"}
                  ${issue.status === "Closed" && "bg-gray-400 text-white"}`}
                                        >
                                            {issue.status}
                                        </span>
                                        <span
                                            className={`text-xs px-3 py-1 rounded-full font-medium
                  ${issue.priority === "HIGH" && "bg-red-500 text-white"}
                  ${issue.priority === "MEDIUM" && "bg-yellow-600 text-white"}
                  ${issue.priority === "LOW" && "bg-green-700 text-white"}`}
                                        >
                                            {issue.priority}
                                        </span>
                                    </div>
                                </Link>
                            </div>

                            {/* Footer: Assignee and Date */}
                            <Link to={`/issues/${issue._id}`} className="block">
                                <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                                    <div className="flex items-center gap-2">
                                        <FaUser className="text-gray-400" />
                                        <span>{issue.assignee || "Unassigned"}</span>
                                    </div>
                                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default IssueList;

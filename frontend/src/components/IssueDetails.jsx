import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";


const IssueDetails = () => {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const navigate = useNavigate();
    const { user } = useAuth();


    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this issue?")) {
            try {
                await axios.delete(API_ENDPOINTS.ISSUE(id));
                navigate("/"); // Redirect to the issue list
            } catch (err) {
                console.error("Error deleting issue:", err);
            }
        }
    };

    useEffect(() => {
        axios.get(API_ENDPOINTS.ISSUE(id))
            .then(res => setIssue(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!issue) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-10">
                <Link to="/" className="text-blue-600  text-sm mb-4 inline-block">
                    &larr; Back to Issues
                </Link>

                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{issue.title}</h2>

                    {/* Edit/Delete buttons */}
                    <div className="flex gap-1">
                        {/* Edit button - show for everyone */}
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

                        {/* Delete button - only show for issue creator or admin */}
                        {user && (issue.createdBy?._id === user._id || user.role === 'admin') && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete();
                                }}
                                className="h-7 w-7 p-0 flex items-center justify-center text-red-500 hover:text-red-700 cursor-pointer"
                                title="Delete issue"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                </div>

                <p className="text-gray-600 mb-4">{issue.description}</p>

                {/* Status and Priority */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium
            ${issue.status === "Open" && "bg-yellow-300 text-white"}
            ${issue.status === "In Progress" && "bg-blue-400 text-white"}
            ${issue.status === "Testing" && "bg-purple-400 text-white"}
            ${issue.status === "Resolved" && "bg-green-400 text-white"}
            ${issue.status === "Closed" && "bg-gray-400 text-white"}`}
                    >
                        Status: {issue.status}
                    </span>
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium
            ${issue.priority === "High" && "bg-red-500 text-white"}
            ${issue.priority === "Medium" && "bg-yellow-600 text-white"}
            ${issue.priority === "Low" && "bg-green-700 text-white"}`}
                    >
                        Priority: {issue.priority}
                    </span>
                </div>

                <div className="text-sm text-gray-500">
                    <p><strong>Assignee:</strong> {issue.assignee || "Unassigned"}</p>
                    <p><strong>Created:</strong> {new Date(issue.createdAt).toLocaleString()}</p>
                    {issue.updatedAt && (
                        <p><strong>Updated:</strong> {new Date(issue.updatedAt).toLocaleString()}</p>
                    )}
                </div>
            </div>
        </div>
    );

};

export default IssueDetails;

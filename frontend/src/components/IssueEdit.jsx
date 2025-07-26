import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const IssueEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Open",
        priority: "MEDIUM",
        assignee: "",
    });

    // Fetch issue data on mount
    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/issues/${id}`)
            .then((res) => setFormData(res.data))
            .catch((err) => console.error("Error loading issue:", err));
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit updated issue
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/issues/${id}`, formData);
            navigate("/");
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update issue: " + (err.response?.data?.error || err.message));
        }
    };

    const onCancel = () => {
        navigate("/");
    };

    return (
        <div className="my-10 p-6 md:p-10 max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[150px]">
                        <label className="block mb-1 font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option>Open</option>
                            <option>In Progress</option>
                            <option>Testing</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="block mb-1 font-medium text-gray-700">Priority</label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="HIGH">HIGH</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="LOW">LOW</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Assignee</label>
                    <input
                        type="text"
                        name="assignee"
                        value={formData.assignee}
                        onChange={handleChange}
                        placeholder="Enter name"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div className="pt-4 gap-2 flex justify-start">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Update Issue
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default IssueEdit;

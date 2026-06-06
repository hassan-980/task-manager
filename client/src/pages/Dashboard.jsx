import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_SERVER_URL;
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Handle Authentication & Initial Fetch
  useEffect(() => {
    if (!token) navigate('/');
    fetchTasks();
    
    if (localStorage.getItem('theme') === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Handle Theme Toggle Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, config);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/tasks`, { title, description }, config);
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      await axios.put(`${API_URL}/api/tasks/${id}`, { status: newStatus }, config);
      fetchTasks();
    } catch (error) {
      console.error("Error toggling status", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, config);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/api/tasks/${id}`, { 
        title: editTitle, 
        description: editDescription 
      }, config);
      cancelEditing();
      fetchTasks();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to format date like "13/10/2023"
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // en-GB gives dd/mm/yyyy format
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] transition-colors duration-300 py-6">
      <div className="container mx-auto p-4 max-w-4xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Dashboard</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded bg-gray-200 dark:bg-[#2c2c2c] text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
            >
              {isDarkMode ?  <MdOutlineLightMode/>  : <MdOutlineDarkMode />}
            </button>
            <button 
              onClick={handleLogout}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded shadow transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Task Form */}
        <form onSubmit={addTask} className="bg-white dark:bg-[#2c2c2c] p-5 rounded-2xl shadow-sm border border-transparent dark:border-gray-700 mb-8 transition-colors duration-300">
          <input 
            type="text" placeholder="Task Title" required
            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-2 px-5 mb-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            value={title} onChange={(e) => setTitle(e.target.value)} 
          />
          <textarea 
            placeholder="Description"
            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-2 px-5 mb-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            value={description} onChange={(e) => setDescription(e.target.value)} 
          />
          <button className="w-full flex justify-center items-center gap-2 bg-blue-500 text-white p-2 rounded-3xl font-semibold hover:bg-blue-600 transition duration-200 shadow-md">
            Add Task <MdOutlineLibraryAdd size={20} />
          </button>
        </form>

        {/* Search Bar Section */}
        <div className="mb-8">
          <input 
            type="text" 
            placeholder="🔍 Search tasks by title or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2c2c2c] text-gray-900 dark:text-white p-2 px-5 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          />
        </div>

        {/* "All Tasks" Heading matching the image */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">All Tasks</h2>
          <div className="w-12 h-1 bg-green-500 mt-2 rounded"></div>
        </div>

        {/* Task Grid List */}
        <div>
          {filteredTasks.length === 0 && tasks.length > 0 ? (
             <p className="text-gray-500 dark:text-gray-400">No tasks found matching "{searchQuery}"</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTasks.map(task => (
                <div key={task._id} className="bg-white dark:bg-[#2c2c2c] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  
                  {editingTaskId === task._id ? (
                    // Edit Mode UI
                    <div className="flex flex-col gap-3 h-full">
                      <input 
                        type="text" 
                        className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)} 
                      />
                      <textarea 
                        className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1a1a1a] text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors flex-grow"
                        value={editDescription} 
                        onChange={(e) => setEditDescription(e.target.value)} 
                      />
                      <div className="flex gap-2 justify-end mt-auto pt-4">
                        <button onClick={cancelEditing} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition duration-200">
                          Cancel
                        </button>
                        <button onClick={() => saveEdit(task._id)} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition duration-200">
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode UI (Matches Image)
                    <>
                      <div className="mb-4 flex-grow">
                        <h3 className={`text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 leading-tight  ${task.status === 'completed' ? 'line-through text-2xl text-gray-500 dark:text-gray-400' : '' }`} >
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                          {task.description}
                        </p>
                      </div>
                      
                      <div className="mt-auto">
                        {/* Date */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">
                          {formatDate(task.createdAt)}
                        </p>
                        
                        {/* Bottom Row: Status Pill & Actions */}
                        <div className="flex justify-between items-center">
                          <button 
                            onClick={() => toggleStatus(task._id, task.status)}
                            className={`px-4 py-1.5 rounded-full text-white text-sm font-medium transition duration-200 ${
                              task.status === 'completed' 
                                ? 'bg-[#5CB85C] hover:bg-[#4cae4c]' // Green from image
                                : 'bg-[#D9534F] hover:bg-[#c9302c]' // Red/Orange from image
                            }`}
                          >
                            {task.status === 'completed' ? 'Done' : 'pending'}
                          </button>
                          
                          <div className="flex gap-4 text-gray-400 dark:text-gray-300">
                            <button 
                              onClick={() => startEditing(task)}
                              disabled={task.status === 'completed'}
                              className={`transition duration-200 ${task.status === 'completed' ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-400'}`}
                            >
                              <FaEdit size={20} />
                            </button>
                            <button 
                              onClick={() => deleteTask(task._id)}
                              className="hover:text-red-400 transition duration-200"
                            >
                              <MdOutlineDelete size={22} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

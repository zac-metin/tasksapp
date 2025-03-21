import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Task from "../components/Task";
import NewTask from "../components/NewTask";

import "./Tasks.css";

const fetchTasks = async () => {
  const response = await axios.get(
    "https://3336gt4pq9.execute-api.ap-southeast-2.amazonaws.com/prod/tasks/"
  );
  return response.data;
};

const Tasks = () => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const tasksPerPage = 8;

  const { data: tasks, isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  const filteredTasks = filterTasks(tasks ?? [], searchQuery);

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredTasks.length / tasksPerPage)));
  }, [filteredTasks]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (isLoading) return <p className="tasks-loading">Loading tasks...</p>;
  if (isError)
    return <p className="tasks-errored">Error fetching tasks: {error.message}</p>;

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );
  
  return (
    <div>
      <div className="task-grid">
        <div className="task-header task-item">
          <input
            className="task-filter"
            type="text"
            placeholder="Filter tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span>Title</span>
          <span>Status</span>
          <span>Description</span>
        </div>

        <TaskList tasks={currentTasks} filteredTasks={filteredTasks} />

        {showNewTaskForm ? (
          <NewTask onCancel={() => setShowNewTaskForm(false)} />
        ) : (
          <button
            onClick={() => setShowNewTaskForm(true)}
            className="new-task-button"
          >
            New Task
          </button>
        )}

        {filteredTasks.length > tasksPerPage && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const filterTasks = (tasks = [], query) => {
  const searchQuery = query.toLowerCase();
  return tasks.filter((task) =>
    [task.title, task.description, task.status]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchQuery))
  );
};

const TaskList = ({ tasks, filteredTasks }) => (
  <ul className="task-list">
    {tasks.length > 0 ? (
      tasks.map((task) => <Task key={task.taskId} task={task} />)
    ) : (
      <p>{filteredTasks.length > 0 ? "No tasks match filter" : "No tasks found"}</p>
    )}
  </ul>
);

export default Tasks;

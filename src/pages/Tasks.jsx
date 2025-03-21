import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Task from "../components/Task";
import NewTask from "../components/NewTask";
import Pagination from "../components/Pagination";

import './Tasks.css'

const fetchTasks = async () => {
  const response = await axios.get('https://3336gt4pq9.execute-api.ap-southeast-2.amazonaws.com/prod/tasks/');
  return response.data;
};

const Tasks = () => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 8;

  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["tasks"], queryFn: fetchTasks });

  if (isLoading) return <p className="tasks-loading">Loading tasks...</p>;
  if (isError) return <p className="tasks-errored">Error fetching tasks: {error.message}</p>;

  const handleInputChange = (event) => setSearchQuery(event.target.value);

  const filteredTasks = filterTasks(tasks, searchQuery);

  const { currentTasks, totalPages } = paginateTasks(filteredTasks, currentPage, tasksPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="task-grid">

        <div className="task-header task-item">
          <input
            className="task-filter"
            type="text"
            placeholder="Filter tasks"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <span>Title</span>
          <span>Status</span>
          <span>Description</span>
        </div>

        <TaskList tasks={currentTasks} filteredTasks={filteredTasks} />

        {showNewTaskForm ? (
          <NewTask onCancel={() => setShowNewTaskForm(false)} />
        ) : (
          <button onClick={() => setShowNewTaskForm(true)} className="new-task-button">
            New Task
          </button>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          filteredTasks={filteredTasks}
          tasksPerPage={tasksPerPage}
        />
      </div>
    </div>
  );
};

const filterTasks = (tasks, query) => {
  return tasks.filter((task) => {
    const searchQuery = query.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchQuery) ||
      (task.description && task.description.toLowerCase().includes(searchQuery)) ||
      task.status.toLowerCase().includes(searchQuery)
    );
  });
};

const paginateTasks = (tasks, currentPage, tasksPerPage) => {
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  
  return { currentTasks, totalPages };
};

const TaskList = ({ tasks, filteredTasks }) => (
  <ul className="task-list">
    {tasks.length > 0 ? (
      tasks.map((task) => <Task key={task.id} task={task} />)
    ) : (
      <p>{filteredTasks.length > 0 ? "No tasks match filter" : "No tasks found"}</p>
    )}
  </ul>
);

export default Tasks;

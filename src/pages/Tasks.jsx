import React from "react";
import { useQuery } from "react-query";
import axios from "axios";

import Task from "../components/Task";

import './Tasks.css'

const fetchTasks = async () => {
  // const response = await axios.get('https://<api-gateway-url>/tasks');
  // return response.data;
  return await [
    { id: 1, title: "Demo Task", status: "IN PROGRESS", description: "This is a demo task." },
    { id: 2, title: "Another Task", status: "TO DO", description: "This is another task." },
  ];
};

const Tasks = () => {
  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } = useQuery("tasks", fetchTasks);

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Error fetching tasks: {error.message}</p>;

  return (
    <div>
      <div className="task-grid">
        <div className="task-header task-item">  
          <span></span>
          <span>Title</span>
          <span>Status</span>
          <span>Description</span>
          <span></span>
        </div>
        <ul>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;

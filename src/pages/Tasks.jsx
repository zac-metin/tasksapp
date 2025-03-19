import React, { useEffect, useState } from "react";
import axios from "axios";

import Task from '../components/Task';

const handleDelete = () => {}
const handleUpdate = () => {}

const TaskList = () => {
  const [tasks, setTasks] = useState([{title: 'Test Task', status: 'In Progress'}]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://<api-gateway-url>/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => <Task task={task} />)}
      </ul>
    </div>
  );
};

export default TaskList;

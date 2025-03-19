

import React, { useEffect, useState } from "react";
import axios from "axios";

const handleDelete = () => {}
const handleUpdate = () => {}

const Task = (props) => {
  const [tasks, setTasks] = useState([{title: 'Test Task', status: 'In Progress'}]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { task } = props;

  useEffect(() => {
    axios
      .get("https://<api-gateway-url>/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => setError(error.message));
  }, []);

  return (
          <li key={task.id}>
            {task.title} - {task.status}
            <button onClick={() => handleDelete(task.id)}>Delete</button>
            <button onClick={() => handleUpdate(task.id)}>Update</button>
          </li>
  );
};

export default Task;
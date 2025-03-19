import React, { useEffect, useState } from "react";
import axios from "axios";

const handleDelete = () => {}
const handleUpdate = () => {}

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks when the component mounts
  useEffect(() => {
    axios
      .get("https://<api-gateway-url>/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks", error));
  }, []);

  // Render the list of tasks
  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.status}
            <button onClick={() => handleDelete(task.id)}>Delete</button>
            <button onClick={() => handleUpdate(task.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

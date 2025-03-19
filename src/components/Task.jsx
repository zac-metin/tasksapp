import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const deleteTask = async (taskId) => {
  const response = await axios.delete(
    `https://<api-gateway-url>/tasks/${taskId}`
  );
  return response.data;
};

const editTask = async (task) => {
  const response = await axios.put(
    `https://<api-gateway-url>/tasks/${task.id}`,
    task
  );
  return response.data;
};

const Task = ({ task }) => {
  const queryClient = useQueryClient();
  const [isEditing, setEditing] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [taskData, setTaskData] = useState(task);

  const { mutate: mutateEdit, isLoading: isEditingTask } = useMutation(editTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
      setEditing(false);
    },
    onError: () => {
      alert("Error updating task.");
    },
  });

  const { mutate: mutateDelete, isLoading: isDeletingTask } = useMutation(
    deleteTask,
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tasks");
        setDeleting(false);
      },
      onError: () => {
        alert("Error deleting task.");
      },
    }
  );

  const handleEdit = () => {
    setEditing(true);
  };
  const handleDelete = (taskId) => {
    setDeleting(true);
    mutateDelete(taskId);
  };

  const handleCancel = () => {
    setEditing(false);
    setTaskData(task); 
  };

  const handleSubmit = () => {
    mutateEdit(taskData); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="task-item">
      {isDeleting ? (
        <p>Deleting...</p>
      ) : isEditing ? (
        <div className="task-edit">
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
          />
          <select
            name="status"
            value={taskData.status}
            onChange={handleInputChange}
          >
            <option value="TO DO">To Do</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSubmit} disabled={isEditingTask}>
            {isEditingTask ? "Saving..." : "Submit"}
          </button>
        </div>
      ) : (
        <div className="task-display">
          <span>{taskData.title}</span>
          <span>{taskData.status}</span>
          <span>{taskData.description}</span>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => handleDelete(taskData.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default Task;

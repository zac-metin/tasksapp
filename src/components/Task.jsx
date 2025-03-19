import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  const editMutation = useMutation({
    mutationFn: editTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditing(false);
    },
    onError: () => {
      alert("Error updating task.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDeleting(false);
    },
    onError: () => {
      alert("Error deleting task.");
    },
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleDelete = async (taskId) => {
    setDeleting(true);
    await deleteMutation.mutateAsync(taskId);
  };

  const handleCancel = () => {
    setEditing(false);
    setTaskData(task);
  };

  const handleSubmit = async () => {
    await editMutation.mutateAsync(taskData);
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
      {deleteMutation.isPending && <p>Deleting...</p>}
      {isEditing ? (
        <>
          <button className="task-cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <input
            type="text"
            name="title"
            value={taskData.title}
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
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
          />
          <button
            className="task-submit-button"
            onClick={handleSubmit}
            disabled={editMutation.isPending}
          >
            {editMutation.isPending ? "Saving..." : "Submit"}
          </button>
        </>
      ) : (
        <div className="task-display">
          <button className="task-edit-button" onClick={handleEdit}>
            Edit
          </button>
          <span>{taskData.title}</span>
          <span>{taskData.status}</span>
          <span>{taskData.description}</span>
          <button
            className="task-delete-button"
            onClick={() => handleDelete(taskData.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Task;
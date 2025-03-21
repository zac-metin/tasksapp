import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const createTask = async (task) => {
  const response = await axios.post(
    "https://3336gt4pq9.execute-api.ap-southeast-2.amazonaws.com/prod/tasks/",
    task
  );
  return response.data;
};

const NewTask = ({ onCancel }) => {
  const queryClient = useQueryClient();
  const [taskData, setTaskData] = useState({
    title: "",
    status: "TO DO",
    description: "",
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onCancel(); 
    },
    onError: () => {
      alert("Error creating task.");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    await createMutation.mutateAsync(taskData);
  };

  return (
    <div className="task-item">
      <button className="task-cancel-button" onClick={onCancel}>
        Cancel
      </button>
      <input
        type="text"
        name="title"
        value={taskData.title}
        onChange={handleInputChange}
        placeholder="Task Title"
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
        placeholder="Task Description"
      />
      <button
        className="task-submit-button"
        onClick={handleSubmit}
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? "Creating..." : "Submit"}
      </button>
    </div>
  );
};

export default NewTask;

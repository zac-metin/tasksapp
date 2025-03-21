import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Task from "./Task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios");

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe("Task Component", () => {
  const task = {
    id: 1,
    title: "Test Task",
    description: "This is a test task",
    status: "TO DO",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render task details", () => {
    useMutation.mockReturnValue({
     mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false,
    });
    render(<Task task={task} />);
    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(screen.getByText(task.status)).toBeInTheDocument();
    expect(screen.getByText(task.description)).toBeInTheDocument();
  });

  it("should allow editing the task", async () => {
    const mockMutate = jest.fn().mockResolvedValue(task);
    useMutation.mockReturnValue({
      mutateAsync: mockMutate,
      isPending: false,
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<Task task={task} />);
    
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Updated Task" } });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith({
        ...task,
        title: "Updated Task",
      });
    });
  });

  it("should handle canceling the edit", () => {
    render(<Task task={task} />);
    fireEvent.click(screen.getByText("Edit"));
  
    fireEvent.click(screen.getByText("Cancel"));
    
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("should delete the task", async () => {
    const mockDeleteMutate = jest.fn().mockResolvedValue({});
    useMutation.mockReturnValue({
      mutateAsync: mockDeleteMutate,
      isPending: false,
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<Task task={task} />);
    
    fireEvent.click(screen.getByText("Delete"));
    
    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith(task.id);
    });
  });

  it("should show deleting message when deleting task", () => {
    const mockDeleteMutate = jest.fn().mockResolvedValue({});
    useMutation.mockReturnValue({
      mutateAsync: mockDeleteMutate,
      isPending: true,
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<Task task={task} />);
    
    fireEvent.click(screen.getByText("Delete"));

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });
});

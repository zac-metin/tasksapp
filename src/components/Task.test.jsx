import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Task from "./Task";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

jest.mock("axios");
jest.mock("react-query", () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe("Task component", () => {
  let task;
  let mockInvalidateQueries;

  beforeEach(() => {
    // Define the mock task
    task = {
      id: 1,
      title: "Test Task",
      description: "Task description",
      status: "TO DO",
    };

    // Mock the useQueryClient hook
    mockInvalidateQueries = jest.fn();
    useQueryClient.mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    // Mock mutations
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
    });
  });

  test("renders task display with Edit and Delete buttons", () => {
    render(<Task task={task} />);

    // Check if task details are displayed
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("TO DO")).toBeInTheDocument();
    expect(screen.getByText("Task description")).toBeInTheDocument();

    // Check if buttons are present
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("enters edit mode when clicking Edit button", () => {
    render(<Task task={task} />);

    fireEvent.click(screen.getByText("Edit"));

    // Check if input fields for editing are rendered
    expect(screen.getByDisplayValue("Test Task")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Task description")).toBeInTheDocument();
    expect(screen.getByDisplayValue("TO DO")).toBeInTheDocument();
  });

  test("cancels edit mode and reverts changes", () => {
    render(<Task task={task} />);

    fireEvent.click(screen.getByText("Edit"));

    // Modify input values
    fireEvent.change(screen.getByDisplayValue("Test Task"), {
      target: { value: "Edited Task" },
    });
    fireEvent.change(screen.getByDisplayValue("Task description"), {
      target: { value: "Edited description" },
    });

    fireEvent.click(screen.getByText("Cancel"));

    // Check if the task reverts to original values
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Task description")).toBeInTheDocument();
    expect(screen.getByText("TO DO")).toBeInTheDocument();
  });

  test("submits task edits and invalidates queries", async () => {
    axios.put.mockResolvedValue({ data: { ...task, title: "Edited Task" } });

    render(<Task task={task} />);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByDisplayValue("Test Task"), {
      target: { value: "Edited Task" },
    });
    fireEvent.click(screen.getByText("Submit"));

    // Wait for the mutation to finish
    await waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith("tasks")
    );

    // Check if the task title has been updated
    expect(screen.getByText("Edited Task")).toBeInTheDocument();
  });

  test("deletes task and invalidates queries", async () => {
    axios.delete.mockResolvedValue({ data: {} });

    render(<Task task={task} />);

    fireEvent.click(screen.getByText("Delete"));

    // Wait for the mutation to finish
    await waitFor(() =>
      expect(mockInvalidateQueries).toHaveBeenCalledWith("tasks")
    );

    // Verify task is deleted (or a confirmation message could be displayed)
    expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
  });

  test("shows loading text when editing or deleting", () => {
    useMutation.mockReturnValue({
      mutate: jest.fn(),
      isLoading: true,
    });

    render(<Task task={task} />);

    // Simulate edit and check loading state
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Saving...")).toBeInTheDocument();

    // Simulate delete and check loading state
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Deleting...")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NewTask from "./NewTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

jest.mock("axios");

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe("NewTask Component", () => {
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useMutation.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false,
    });
  });

  it("should render the New Task form", () => {
    render(<NewTask onCancel={mockOnCancel} />);

    expect(screen.getByPlaceholderText("Task Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Task Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("should allow filling out the form", () => {
    render(<NewTask onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByPlaceholderText("Task Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Task Description"), {
      target: { value: "This is a test task description" },
    });

    expect(screen.getByPlaceholderText("Task Title").value).toBe("Test Task");
    expect(screen.getByPlaceholderText("Task Description").value).toBe(
      "This is a test task description"
    );
  });

  it("should submit the form and call createTask mutation", async () => {
    const mockCreateTask = jest.fn().mockResolvedValue({
      id: 1,
      title: "Test Task",
      description: "This is a test task description",
      status: "TO DO",
    });
    useMutation.mockReturnValue({
      mutateAsync: mockCreateTask,
      isPending: false,
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<NewTask onCancel={mockOnCancel} />);

    fireEvent.change(screen.getByPlaceholderText("Task Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Task Description"), {
      target: { value: "This is a test task description" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledTimes(1);
      expect(mockCreateTask).toHaveBeenCalledWith({
        title: "Test Task",
        description: "This is a test task description",
        status: "TO DO",
      });
    });
  });

  it("should call onCancel when the cancel button is clicked", () => {
    render(<NewTask onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});

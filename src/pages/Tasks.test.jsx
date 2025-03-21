import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Tasks from "./Tasks";
import { useQuery, useQueryClient } from "@tanstack/react-query";

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
}));

describe("Tasks Component", () => {
  it("renders tasks when data is loaded", async () => {
    const mockTasks = [
      { id: "1", title: "Task 1", description: "Description 1", status: "TO DO" },
      { id: "2", title: "Task 2", description: "Description 2", status: "IN PROGRESS" },
    ];

    useQuery.mockReturnValue({
      data: mockTasks,
      isLoading: false,
      isError: false,
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<Tasks />);

    await waitFor(() => screen.getByText("Task 1"));

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("shows loading message while data is loading", () => {
    useQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<Tasks />);

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("shows error message if data fails to load", () => {
    useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: "Error fetching tasks" },
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<Tasks />);

    expect(screen.getByText("Error fetching tasks: Error fetching tasks")).toBeInTheDocument();
  });

  it("filters tasks based on search query", async () => {
    const mockTasks = [
      { id: "1", title: "Task 1", description: "Description 1", status: "TO DO" },
      { id: "2", title: "Task 2", description: "Description 2", status: "IN PROGRESS" },
    ];

    useQuery.mockReturnValue({
      data: mockTasks,
      isLoading: false,
      isError: false,
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<Tasks />);

    const searchInput = screen.getByPlaceholderText("Filter tasks");

    fireEvent.change(searchInput, { target: { value: "Task 1" } });

    await waitFor(() => screen.getByText("Task 1"));
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
  });

  it("shows 'No tasks found' message when there are no tasks", async () => {
    const mockTasks = [];

    useQuery.mockReturnValue({
      data: mockTasks,
      isLoading: false,
      isError: false,
    });
    useQueryClient.mockReturnValue({
      invalidateQueries: jest.fn(),
    });

    render(<Tasks />);

    await waitFor(() => screen.getByText("No tasks found"));
    expect(screen.getByText("No tasks found")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  const mockOnPageChange = jest.fn();

  const setup = (props) => {
    render(<Pagination {...props} />);
  };

  it("should render pagination controls", () => {
    const props = {
      currentPage: 1,
      totalPages: 5,
      onPageChange: mockOnPageChange,
      filteredTasks: Array(50).fill({title: "task", status:"In Progress", description: "its a task"}),
      tasksPerPage: 10,
    };

    setup(props);

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();

    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();
  });

  it("should disable Previous button on first page", () => {
    const props = {
      currentPage: 1,
      totalPages: 5,
      onPageChange: mockOnPageChange,
      filteredTasks: Array(50).fill({title: "task", status:"In Progress", description: "its a task"}),
      tasksPerPage: 10,
    };

    setup(props);

    const prevButton = screen.getByText("Previous");
    expect(prevButton).toBeDisabled();
  });

  it("should disable Next button on last page", () => {
    const props = {
      currentPage: 5,
      totalPages: 5,
      onPageChange: mockOnPageChange,
      filteredTasks: Array(50).fill("task"),
      tasksPerPage: 10,
    };

    setup(props);

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should call onPageChange when clicking Next", () => {
    const props = {
      currentPage: 1,
      totalPages: 5,
      onPageChange: mockOnPageChange,
      filteredTasks: Array(50).fill("task"),
      tasksPerPage: 10,
    };

    setup(props);

    fireEvent.click(screen.getByText("Next"));

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageChange when clicking Previous", () => {
    const props = {
      currentPage: 3,
      totalPages: 5,
      onPageChange: mockOnPageChange,
      filteredTasks: Array(50).fill("task"),
      tasksPerPage: 10,
    };

    setup(props);

    fireEvent.click(screen.getByText("Previous"));

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("should not render pagination if there are fewer tasks than tasksPerPage", () => {
    const props = {
      currentPage: 1,
      totalPages: 1,
      onPageChange: mockOnPageChange,
      filteredTasks: Array(5).fill({title: "task", status:"In Progress", description: "its a task"}),
      tasksPerPage: 10,
    };

    setup(props);

    expect(screen.queryByText("Previous")).toBeNull();
    expect(screen.queryByText("Next")).toBeNull();
  });
});

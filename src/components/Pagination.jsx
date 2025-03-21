const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  filteredTasks,
  tasksPerPage,
}) =>
  filteredTasks.length > tasksPerPage && (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );

export default Pagination;

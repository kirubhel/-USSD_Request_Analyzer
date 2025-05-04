interface Props {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
  }
  
  export default function Pagination({ totalPages, currentPage, setCurrentPage }: Props) {
    return (
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 text-sm rounded border ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  }
  
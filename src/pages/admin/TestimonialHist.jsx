import React, { useState, useMemo } from "react";
import { Pencil, Trash } from "lucide-react";
import assets from "../../assets/assests";
import PaginationControls from "../../utilities/PaginationControls";

const TestimonialHist = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const testimonials = [
    {
      id: "001",
      name: "Dorcas Odekunle",
      rating: "5 star",
      comment: "Wellthrix has been so help........",
      image: "assets",
    },
    // ...more testimonials here
  ];

  const totalPages = Math.ceil(testimonials.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return testimonials.slice(start, start + rowsPerPage);
  }, [currentPage, testimonials]);

  return (
    <div className="shadow-sm rounded bg-white overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
            <th className="p-5">ID</th>
            <th className="p-5">Name</th>
            <th className="p-5">Rating</th>
            <th className="p-5">Comment</th>
            <th className="p-5">Image</th>
            <th className="p-5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-gray-50 text-sm border-b border-black/10 text-center"
              >
                <td className="p-4">{t.id}</td>
                <td className="p-4">{t.name}</td>
                <td className="p-4">{t.rating}</td>
                <td className="p-4">{t.comment}</td>
                <td className="p-4">
                  {t.image && (
                    <img
                      src={assets.testi}
                      alt="testimonial"
                      className="w-10 h-10 rounded object-cover mx-auto"
                    />
                  )}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="text-green-800 hover:text-green-600">
                      <Pencil size={16} />
                    </button>
                    <button className="text-green-800 hover:text-red-500">
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-8">
                No testimonials found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {currentData.length > 0 && (
        <div className="flex justify-center items-center gap-2 p-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default TestimonialHist;

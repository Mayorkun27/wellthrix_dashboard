import React, { useState, useEffect } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext'; // Adjust path as needed
import PaginationControls from '../../utilities/PaginationControls'; // Adjust path as needed
import { formatISODateToCustom } from '../../utilities/Formatterutility'; // Adjust path as needed

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

const Stockist = () => {
  const { token, logout, user } = useUser(); // Assuming user contains stockistId
  const stockistId = user?.id || 1; // Fallback to 1 if not available; adjust as needed
  const [pickupOrders, setPickupOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pickupPage, setPickupPage] = useState(1);
  const [totalPickupPages, setTotalPickupPages] = useState(1);
  const perPage = 5;

  const statusColorsPickup = {
    pending: 'border border-[#EC3030]/20 text-[#FF0000]/80',
    Picked: 'border border-[#4B7233]/20 text-[#4B7233]/80',
    success: 'border border-[#4BA312]/20 text-[#4BA312]/80', // Added for potential status
  };

  // Fetch Pickup Orders via POST
  const fetchPickupOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/stockists/${stockistId}/user`,
        { page: pickupPage, perPage: perPage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("response", response);

      if (response.status === 200) {
        const { transactions, current_page, last_page } = response.data;
        setPickupOrders(transactions);
        setPickupPage(current_page);
        setTotalPickupPages(last_page);
        toast.success('Pickup orders fetched successfully');
      } else {
        throw new Error(response.data.message || 'Failed to fetch pickup orders.');
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) {
        logout();
      }
      console.error('Pickup orders fetch error:', error);
      toast.error(error.response?.data?.message || 'An error occurred fetching pickup orders.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when page or token changes
  useEffect(() => {
    if (token && stockistId) {
      fetchPickupOrders();
    }
  }, [pickupPage, token, stockistId]);

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm flex flex-col gap-2">
      <div className="overflow-x-auto">
        <table className="w-full text-base mt-4 whitespace-nowrap">
          <thead className="text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-6 text-center">S/N</th>
              <th className="px-4 py-6 text-center">Name</th>
              <th className="px-4 py-6 text-center">Ref ID</th>
              <th className="px-4 py-6 text-center">Product</th>
              <th className="px-4 py-6 text-center">Date</th>
              <th className="px-4 py-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center p-8">Loading...</td>
              </tr>
            ) : pickupOrders.length > 0 ? (
              pickupOrders.map((order, index) => {
                console.log("order", order); // Debug each order object
                return (
                  <tr key={order.id} className="border-b border-black/10">
                    <td className="px-4 py-6 text-center">{index+1}</td>
                    <td className="px-4 py-6 text-center">{`${order.order.user?.first_name || ''} ${order.order.user?.last_name || ''}`.trim() || '-'}</td>
                    <td className="px-4 py-6 text-center">{order.ref_no || '-'}</td>
                    <td className="px-4 py-6 text-center">{order.order.product?.product_name || '-'}</td>
                    <td className="px-4 py-6 text-center text-pryClr font-semibold">{formatISODateToCustom(order.created_at).split(" ")[0] || '-'}</td>
                    <td className="px-4 py-6 text-center">
                      <span className={`px-2 py-2 rounded-full text-xs ${statusColorsPickup[order.order?.delivery] || 'text-gray-600'}`}>
                        {order.order?.delivery || 'Unknown'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-8">No pickup orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {!isLoading && pickupOrders.length > 0 && (
          <PaginationControls
            currentPage={pickupPage}
            totalPages={totalPickupPages}
            setCurrentPage={setPickupPage}
          />
        )}
      </div>
    </div>
  );
};

export default Stockist;
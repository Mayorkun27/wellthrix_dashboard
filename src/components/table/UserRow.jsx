// src/components/users/UserRow.jsx
import { FaTrashAlt } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import { formatISODateToCustom, formatterUtility } from "../../utilities/formatterutility";
import { MdOutlineLockReset, MdRemoveRedEye } from "react-icons/md";
import Modal from "../modals/Modal";
import { useState } from "react";
import OverviewCards from "../cards/OverviewCards";
import { Link } from "react-router-dom";

const UserRow = ({
  user,
  index,
  currentPage,
  perPage,
  searchQuery,
  onDelete,
  onUpgrade,
  onToggleStatus,
  onEnableStockist,
  onResetCredentials
}) => {
  const serialNumber = (currentPage - 1) * perPage + (index + 1);
  const accountStatusText = Number(user.enabled) === 1 ? "Active" : "Deactivated";

  return (
    <>
      <tr className="hover:bg-gray-50 text-sm border-b border-black/10 text-center">
        <td className="p-3">{!searchQuery ? String(serialNumber).padStart(3, "0") : "001"}</td>
        <td className="p-4 capitalize">{`${user.first_name} ${user.last_name}` || "-"}</td>
        <td className="p-4">{formatterUtility(Number(user.earning_wallet)) || "-"}</td>
        <td className="p-4">{user.email || "-"}</td>
        <td className="p-4">{user.username || "-"}</td>
        <td className="p-4 capitalize">{user.mobile || "-"}</td>
        <td className="p-4 capitalize">{user.plan_name || "-"}</td>

        <td className="p-4 capitalize font-semibold">
          {Number(user.stockist_enabled) === 1 ? "Yes" : "No"}
        </td>

        <td className="p-4 capitalize font-semibold">
          {accountStatusText}
        </td>

        <td className="p-4 text-sm text-pryClr font-semibold">
          {formatISODateToCustom(user.created_at)}
        </td>

        <td className="p-4 text-sm text-pryClr font-semibold">
          <Link
            to={`/admin/allusers/${user?.id}`}
            title={`View ${user.username} info`}
            className="text-yellow-600 md:text-2xl text-xl hover:text-yellow-600/90 cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-yellow-600/10 transition-all duration-300 rounded-lg mx-auto"
          >
            <MdRemoveRedEye />
          </Link>
        </td>
      </tr>
    </>
  );
};

export default UserRow;

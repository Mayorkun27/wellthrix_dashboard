// src/components/users/UserRow.jsx
import { FaTrashAlt } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import { formatISODateToCustom, formatterUtility } from "../../utilities/formatterutility";

const UserRow = ({
  user,
  index,
  currentPage,
  perPage,
  onDelete,
  onUpgrade,
  onToggleStatus,
  onEnableStockist,
}) => {
  const serialNumber = (currentPage - 1) * perPage + (index + 1);
  const accountStatusText = Number(user.enabled) === 1 ? "Active" : "Deactivated";
  const accountStatusClass =
    Number(user.enabled) === 1
      ? "bg-[#e5f9f1] hover:bg-[#dff7ee]"
      : "hover:bg-[#f2f2f2] bg-[#e5e7eb]";

  return (
    <tr className="hover:bg-gray-50 text-sm border-b border-black/10 text-center">
      <td className="p-3">{String(serialNumber).padStart(3, "0")}</td>
      <td className="p-4 capitalize">{`${user.first_name} ${user.last_name}` || "-"}</td>
      {/* <td className="p-4">{formatterUtility(Number(user.earning_wallet)) || "-"}</td> */}
      <td className="p-4">{user.email || "-"}</td>
      <td className="p-4">{user.username || "-"}</td>
      <td className="p-4 capitalize">{user.mobile || "-"}</td>
      {/* <td className="p-4 capitalize">{user.plan || "-"}</td> */}

      <td className="p-4 capitalize">
        <button
          type="button"
          className="bg-accClr w-[100px] h-[40px] rounded font-semibold cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onEnableStockist(user)}
          disabled={Number(user.stockist_enabled) === 1}
        >
          {Number(user.stockist_enabled) === 1 ? "Enabled" : "Enable"}
        </button>
      </td>

      <td className="p-4 capitalize">
        <button
          type="button"
          className={`w-[100px] h-[40px] rounded-md font-semibold cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-pryClr/20 ${accountStatusClass} transition-all duration-300`}
          onClick={() => onToggleStatus(user)}
        >
          {accountStatusText}
        </button>
      </td>

      <td className="p-4 text-sm text-pryClr font-semibold">
        {formatISODateToCustom(user.created_at)}
      </td>

      <td className="p-4 text-sm text-pryClr font-semibold">
        <div className="flex items-center gap-2">
          <button
            type="button"
            title={`Delete ${user.username}`}
            onClick={() => onDelete(user)}
            className="text-red-600 hover:text-red-700 cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto"
          >
            <FaTrashAlt />
          </button>

          <button
            type="button"
            title={`Upgrade ${user.username}`}
            onClick={() => onUpgrade(user)}
            className="text-pryClr text-lg hover:text-pryClr/90 cursor-pointer w-10 h-10 flex justify-center items-center hover:bg-pryClr/10 transition-all duration-300 rounded-lg mx-auto"
          >
            <GiUpgrade />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;

import React, { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import PaginationControls from "../../../utilities/PaginationControls";
import UserRow from "../../../components/table/UserRow";
import EnableStockistModal from "../../../components/modals/EnableStockistModal";
import Modal from "../../../components/modals/Modal";
import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";
import { useUsersData } from "../../../hooks/useUsersData";
import { useUserActions } from "../../../hooks/useUserActions";
import { FiSearch } from 'react-icons/fi';

const AllUsers = () => {
  const { token, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState(""); 

  const {
    users: allUsers,
    isLoading,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    refetch,
  } = useUsersData({ token, logout, searchQuery: submittedQuery, initialPage: 1, initialPerPage: 5 });

  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogs, setDialogs] = useState({
    delete: false,
    enableStockist: false,
    toggleAccount: false,
    upgrade: false,
    resetCredentials: false
  });

  const {
    confirmDelete,
    confirmEnableStockist,
    confirmToggleAccount,
    confirmUpgradeUser,
    confirmResetCredentials
  } = useUserActions({ token, logout, refetch });

  const [isEnabling, setIsEnabling] = useState(false);

  const openDialog = (key, user = null) => {
    setSelectedUser(user);
    setDialogs((d) => ({ ...d, [key]: true }));
  };

  const closeDialog = (key) => {
    setDialogs((d) => ({ ...d, [key]: false }));
    if (key !== "enableStockist") setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          setSubmittedQuery(searchQuery)
        }}
        className="md:w-1/2 relative"
      >
        <input
          type="text"
          placeholder="Search users by username or email..."
          className="w-full pl-4 pr-[50px] h-[50px] border border-pryClr/30 focus:border-pryClr/50 shadow-md rounded-lg focus:outline-none"
          value={searchQuery}
          onChange={(e) => {
            if (e.target.value.trim() === "") {
              setSubmittedQuery("");
              setSearchQuery("");
              return;
            }
            setCurrentPage(1)
            setSearchQuery(e.target.value)
          }}
        />
        <button
          type="submit"
          disabled={!searchQuery.trim()}
          className="absolute right-[5px] top-1/2 -translate-y-1/2 text-pryClr bg-accClr w-[40px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 h-[calc(100%-10px)] flex items-center justify-center rounded-md"
        >
          <FiSearch className="" size={20} />
        </button>
      </form>
      <div className="shadow-sm rounded bg-white overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
              <th className="p-5">ID</th>
              <th className="p-5">Name</th>
              <th className="p-5">Earnings</th>
              <th className="p-5">Email</th>
              <th className="p-5">Username</th>
              <th className="p-5">Phone</th>
              <th className="p-5">Plan</th>
              <th className="p-5">Is Stockist?</th>
              <th className="p-5">Account Status</th>
              <th className="p-5">Date Joined</th>
              <th className="p-5">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                {/* 10 columns total */}
                <td colSpan="10" className="text-center p-8">
                  Loading...
                </td>
              </tr>
            ) : allUsers.length > 0 ? (
              allUsers.map((item, index) => (
                <UserRow
                  key={item.id}
                  user={item}
                  index={index}
                  perPage={perPage}
                  currentPage={currentPage}
                  searchQuery={searchQuery}
                  onDelete={(u) => openDialog("delete", u)}
                  onUpgrade={(u) => openDialog("upgrade", u)}
                  onToggleStatus={(u) => openDialog("toggleAccount", u)}
                  onEnableStockist={(u) => openDialog("enableStockist", u)}
                  onResetCredentials={(u) => openDialog("resetCredentials", u)}
                />
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-8">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {!isLoading && !searchQuery && allUsers.length > 0 && (
          <div className="flex justify-center items-center gap-2 p-4">
            <PaginationControls
              currentPage={currentPage}
              totalPages={lastPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}

        {/* Delete user */}
        {dialogs.delete && (
          <Modal onClose={() => closeDialog("delete")}>
            <ConfirmationDialog
              message={
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedUser?.username}</span>? This
                  action cannot be undone.
                </>
              }
              onConfirm={async () => {
                await confirmDelete(selectedUser);
                closeDialog("delete");
                setSelectedUser(null);
              }}
              onCancel={() => closeDialog("delete")}
            />
          </Modal>
        )}

        {/* Enable stockist */}
        <EnableStockistModal
          open={dialogs.enableStockist}
          user={selectedUser}
          onClose={() => {
            closeDialog("enableStockist");
            setSelectedUser(null);
          }}
          isSubmitting={isEnabling}
          onConfirm={async ({ plan, location }) => {
            setIsEnabling(true);
            await confirmEnableStockist({
              user: selectedUser,
              plan,
              location,
              onFinally: () => {
                setIsEnabling(false);
                closeDialog("enableStockist");
                setSelectedUser(null);
              },
            });
          }}
        />

        {/* Toggle account status */}
        {dialogs.toggleAccount && (
          <Modal
            onClose={() => {
              closeDialog("toggleAccount");
              setSelectedUser(null);
            }}
          >
            <ConfirmationDialog
              type="confirm"
              title={`Confirm ${Number(selectedUser?.enabled) === 1 ? "deactivation" : "activation"}?`}
              message={
                <>
                  Are you sure you want to{" "}
                  {Number(selectedUser?.enabled) === 1 ? "deactivate" : "activate"}{" "}
                  <span className="font-semibold">{selectedUser?.username}</span>
                  's account?
                </>
              }
              onConfirm={async () => {
                await confirmToggleAccount(selectedUser);
                closeDialog("toggleAccount");
                setSelectedUser(null);
              }}
              onCancel={() => {
                closeDialog("toggleAccount");
                setSelectedUser(null);
              }}
            />
          </Modal>
        )}

        {/* Upgrade user */}
        {dialogs.upgrade && (
          <Modal
            onClose={() => {
              closeDialog("upgrade");
              setSelectedUser(null);
            }}
          >
            <ConfirmationDialog
              type="confirm"
              title="Confirm User Upgrade?"
              message={
                <>
                  Are you sure you want to upgrade{" "}
                  <span className="font-semibold">{selectedUser?.username}</span>? This
                  action might have irreversible effects.
                </>
              }
              onConfirm={async () => {
                await confirmUpgradeUser(selectedUser);
                closeDialog("upgrade");
                setSelectedUser(null);
              }}
              onCancel={() => {
                closeDialog("upgrade");
                setSelectedUser(null);
              }}
            />
          </Modal>
        )}

        {/* Reset user credentials*/}
        {dialogs.resetCredentials && (
          <Modal
            onClose={() => {
              closeDialog("resetCredentials");
              setSelectedUser(null);
            }}
          >
            <ConfirmationDialog
              type="confirm"
              title="Confirm credentials reset?"
              message={
                <>
                  Are you sure you want to reset{" "}
                  <span className="font-semibold">{selectedUser?.username}</span> password and pin back to default? This
                  action might have irreversible effects.
                </>
              }
              onConfirm={async () => {
                await confirmResetCredentials(selectedUser);
                closeDialog("resetCredentials");
                setSelectedUser(null);
              }}
              onCancel={() => {
                closeDialog("resetCredentials");
                setSelectedUser(null);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AllUsers;

import React, { useState } from "react";
import { useUser } from "../../../context/UserContext";
import PaginationControls from "../../../utilities/PaginationControls";
import UserRow from "../../../components/table/UserRow";
import EnableStockistModal from "../../../components/modals/EnableStockistModal";
import Modal from "../../../components/modals/Modal";
import ConfirmationDialog from "../../../components/modals/ConfirmationDialog";
import { useUsersData } from "../../../hooks/useUsersData";
import { useUserActions } from "../../../hooks/useUserActions";

const AllUsers = () => {
  const { token, logout } = useUser();

  // Data + pagination
  const {
    users: allUsers,
    isLoading,
    currentPage,
    setCurrentPage,
    lastPage,
    perPage,
    refetch,
  } = useUsersData({ token, logout, initialPage: 1, initialPerPage: 5 });

  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogs, setDialogs] = useState({
    delete: false,
    enableStockist: false,
    toggleAccount: false,
    upgrade: false,
  });

  const {
    confirmDelete,
    confirmEnableStockist,
    confirmToggleAccount,
    confirmUpgradeUser,
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
    <div className="shadow-sm rounded bg-white overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="text-black/70 text-[12px] uppercase text-center border-b border-black/20">
            <th className="p-5">ID</th>
            <th className="p-5">Name</th>
            <th className="p-5">Email</th>
            <th className="p-5">Username</th>
            <th className="p-5">Phone</th>
            {/* <th className="p-5">Plan</th> */}
            <th className="p-5">Stockist Enabled</th>
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
                onDelete={(u) => openDialog("delete", u)}
                onUpgrade={(u) => openDialog("upgrade", u)}
                onToggleStatus={(u) => openDialog("toggleAccount", u)}
                onEnableStockist={(u) => openDialog("enableStockist", u)}
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

      {!isLoading && allUsers.length > 0 && (
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
    </div>
  );
};

export default AllUsers;

// src/hooks/useUserActions.js
import { toast } from "sonner";
import { deleteUser, enableStockist, resetCredentials, toggleAccount, upgradeUser } from "../services/userService";
import { handleAuthError } from "../utilities/handleAuthError";

export const useUserActions = ({ token, logout, refetch }) => {
  const confirmDelete = async (user) => {
    if (!user?.id) return;
    const toastId = toast.loading("Deleting user...");
    try {
      const res = await deleteUser(token, user.id);
      toast.success(res.data?.message || "User deleted successfully", { id: toastId });
      refetch();
    } catch (err) {
      handleAuthError(err, logout);
      console.error("Delete user error:", err);
      toast.error(err?.response?.data?.message || "An error occurred deleting the user.", { id: toastId });
    }
  };

  const confirmEnableStockist = async ({ user, plan, location, onFinally }) => {
    if (!user?.id || !plan || !location) {
      toast.error("Please select a plan and enter a location.");
      return;
    }
    const toastId = toast.loading(`Enabling ${user.username} as stockist...`);
    try {
      const res = await enableStockist(token, user.id, {
        stockist_plan: plan,
        stockist_location: location,
      });
      toast.success(res.data?.message || `${user.username} is now a stockist!`, { id: toastId });
      refetch();
    } catch (err) {
      handleAuthError(err, logout);
      console.error("Enable stockist error:", err);
      toast.error(err?.response?.data?.message || "An error occurred enabling stockist.", { id: toastId });
    } finally {
      onFinally?.();
    }
  };

  const confirmToggleAccount = async (user) => {
    if (!user?.id) return;
    const isEnabled = Number(user.enabled) === 1;
    const actionText = isEnabled ? "Deactivating" : "Activating";
    const toastId = toast.loading(`${actionText} ${user.username}'s account...`);
    try {
      const res = await toggleAccount(token, user.id, isEnabled);
      const successText = isEnabled ? "User account deactivated successfully!" : "User account activated successfully!";
      toast.success(res.data?.message || successText, { id: toastId });
      refetch();
    } catch (err) {
      handleAuthError(err, logout);
      console.error("Toggle account error:", err);
      const errorText = isEnabled ? "Failed to deactivate user account." : "Failed to activate user account.";
      toast.error(err?.response?.data?.message || errorText, { id: toastId });
    }
  };

  const confirmUpgradeUser = async (user) => {
    if (!user?.id) return;
    const toastId = toast.loading(`Upgrading ${user.username}...`);
    try {
      const res = await upgradeUser(token, user.id);
      toast.success(res.data?.message || `${user.username} upgraded successfully!`, { id: toastId });
      refetch();
    } catch (err) {
      handleAuthError(err, logout);
      console.error("User upgrade error:", err);
      toast.error(err?.response?.data?.message || "An error occurred during user upgrade.", { id: toastId });
    }
  };

  const confirmResetCredentials = async (user) => {
    if (!user?.id) return;
    const toastId = toast.loading(`Resetting credentials...`);
    try {
      const res = await resetCredentials(token, user.id);
      toast.success(res.data?.message || `Credentials reset successfully!`, { id: toastId });
      refetch();
    } catch (err) {
      handleAuthError(err, logout);
      console.error("Credentials reset error:", err);
      toast.error(err?.response?.data?.message || "An error occurred resetting credentials.", { id: toastId });
    }
  };

  return {
    confirmDelete,
    confirmEnableStockist,
    confirmToggleAccount,
    confirmUpgradeUser,
    confirmResetCredentials
  };
};

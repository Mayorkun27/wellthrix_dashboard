import React, { useCallback, useEffect, useState } from 'react'
import { getAUser } from '../../../services/userService';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { toast } from 'sonner';
import { handleAuthError } from '../../../utilities/handleAuthError';
import OverviewCards from '../../../components/cards/OverviewCards';
import { FaTrashAlt } from 'react-icons/fa';
import { MdOutlineAccountBalanceWallet, MdOutlineSdCard, MdOutlineLockReset } from 'react-icons/md'
import { IoWalletOutline } from 'react-icons/io5'
import { GiElectric, GiWallet, GiUpgrade } from 'react-icons/gi'
import { BsWallet2 } from 'react-icons/bs'
import { PiHandDeposit, PiHandWithdraw } from 'react-icons/pi'
import { useUserActions } from '../../../hooks/useUserActions';
import Modal from '../../../components/modals/Modal';
import EnableStockistModal from '../../../components/modals/EnableStockistModal';
import ConfirmationDialog from '../../../components/modals/ConfirmationDialog';

const EachUser = () => {
    const { token, logout } = useUser();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserDetails = useCallback(async () => {
        setIsLoading(true);
        try {
          const res = await getAUser(token, id);
          console.log("res", res)
          if (res.status === 200) {
            setUser(res.data?.user);
          } else {
            throw new Error(res.data.message || "Failed to get user.");
          }
        } catch (err) {
          handleAuthError(err, logout);
          console.error("Get user error:", err);
          toast.error(err?.response?.data?.message || "An error occurred geting user.");
        } finally {
          setIsLoading(false);
        }
    }, [token, logout, id]);
    
    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

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
    } = useUserActions({ token, logout, refetch: fetchUserDetails });

    const [isEnabling, setIsEnabling] = useState(false);
    
    const openDialog = (key) => {
        setDialogs((d) => ({ ...d, [key]: true }));
    };
    
    const closeDialog = (key) => {
        setDialogs((d) => ({ ...d, [key]: false }));
    };

    const overviews = [
      {
        walletType: "Total Earnings",
        amount: user?.total_earning,
        icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
            <MdOutlineAccountBalanceWallet />
          </div>,
        buttonType: 1,
      },
      {
        walletType: "E-Wallet",
        amount: user?.e_wallet,
        icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
            <MdOutlineAccountBalanceWallet />
          </div>,
        buttonType: 1,
      },
      {
        walletType: "Repurchase Wallet",
        amount: user?.purchased_wallet,
        icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
            <IoWalletOutline />
          </div>,
        buttonType: 1,
      },
      {
        walletType: "Earnings Wallet",
        amount: user?.earning_wallet,
        icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
            <GiWallet />
          </div>,
        buttonType: 1,
      },
      {
        walletType: "Incentive Wallet",
        amount: user?.incentive_wallet,
        icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
            <BsWallet2 />
          </div>,
        buttonType: 1,
      },
    //   {
    //     walletType: "Total Credit",
    //     amount: user?.total_credit,
    //     icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
    //         <PiHandDeposit />
    //       </div>,
    //     buttonType: 1,
    //   },
    //   {
    //     walletType: "Total Debit",
    //     amount: user?.total_debit,
    //     icon: <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
    //         <PiHandWithdraw />
    //       </div>,
    //     buttonType: 1,
    //   },
    ]

    if (isLoading) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <div className='w-10 h-10 border-4 border-pryClr border-t-transparent animate-spin rounded-full mx-auto'></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <p>User not found or an error occurred.</p>
            </div>
        )
    }

    const accountStatusText = Number(user.enabled) === 1 ? `Deactivate user` : `Activate user`;
    const accountStatusClass =
        Number(user.enabled) === 1
        ? "bg-[#e5f9f1] hover:bg-[#dff7ee]"
        : "hover:bg-[#f2f2f2] bg-[#e5e7eb]";

    return (
        <>
            <div className='space-y-4'>
                <div>
                    <h3 className="md:text-2xl text-xl font-semibold mb-4"><span className='capitalize'>{user.username}</span>&apos;s Details</h3>
                    <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 h-full mb-6">
                        {
                            overviews.map((overview, index) => (
                            <div className="h-full" key={index}>
                                <OverviewCards {...overview} />
                            </div>
                            ))
                        }
                    </div>
                </div>

                <div>
                    <h3 className="md:text-2xl text-xl font-semibold mt-4">Profile</h3>
                    <div className="mt-4 bg-white shadow-sm rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="grid md:grid-cols-2">
                                <span className="font-semibold text-black/70">Full Name:</span>
                                <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <span className="font-semibold text-black/70">Username:</span>
                                <span>{user.username}</span>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <span className="font-semibold text-black/70">Email:</span>
                                <span>{user.email}</span>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <span className="font-semibold text-black/70">Phone Number:</span>
                                <span>{user.mobile}</span>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <span className="font-semibold text-black/70">Country:</span>
                                <span className="capitalize">{user.country}</span>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <span className="font-semibold text-black/70">Gender:</span>
                                <span className="capitalize">{user.gender}</span>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <span className="font-semibold text-black/70">Account Status:</span>
                                <span className={`capitalize px-2 py-1 text-xs w-max rounded-full ${ Number(user.enabled) === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`}>
                                    {Number(user.enabled) === 1 ? "Active" : "Deactivated"}
                                </span>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <span className="font-semibold text-black/70">Is Stockist:</span>
                                <span>{Number(user.stockist_enabled) === 1 ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="md:text-2xl text-xl font-semibold mt-4">Actions</h3>
                    <div className="grid md:grid-cols-3 grid-cols-1 items-center gap-4 mt-4">
                        <button
                            type="button"
                            title={`Reset ${user.username} credentials`}
                            onClick={() => openDialog("resetCredentials")}
                            className="cursor-pointer w-full h-[50px] flex gap-2 justify-center items-center bg-accClr transition-all duration-300 rounded-md mx-auto"
                        >
                            <MdOutlineLockReset size={20} />
                            <span>Reset user credentials</span>
                        </button>

                        <button
                            type="button"
                            className={`w-full h-[50px] rounded-md font-semibold cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-pryClr/20 ${accountStatusClass} transition-all duration-300`}
                            onClick={() => openDialog("toggleAccount")}
                        >
                            {accountStatusText}
                        </button>

                        <button
                            type="button"
                            className="bg-accClr w-full h-[50px] rounded font-semibold cursor-pointer text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => openDialog("enableStockist")}
                            disabled={Number(user.stockist_enabled) === 1}
                        >
                            {Number(user.stockist_enabled) === 1 ? "Enabled as Stockist" : "Enable user as stockist"}
                        </button>

                        <button
                            type="button"
                            title={`Delete ${user.username}`}
                            onClick={() => openDialog("delete")}
                            className="cursor-pointer text-secClr w-full h-[50px] flex gap-2 justify-center items-center bg-red-600 transition-all duration-300 rounded-md mx-auto"
                        >
                            <FaTrashAlt />
                            <span>Delete {user.username}</span>
                        </button>

                        <button
                            type="button"
                            title={`Upgrade ${user.username}`}
                            onClick={() => openDialog("upgrade")}
                            className="cursor-pointer text-secClr w-full h-[50px] flex gap-2 justify-center items-center bg-pryClr transition-all duration-300 rounded-md mx-auto"
                        >
                            <GiUpgrade />
                            <span>Upgrade {user.username}</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Delete user */}
            {dialogs.delete && (
                <Modal onClose={() => closeDialog("delete")}>
                    <ConfirmationDialog
                        message={
                            <>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold">{user?.username}</span>? This
                                action cannot be undone.
                            </>
                        }
                        onConfirm={async () => {
                            await confirmDelete(user);
                            closeDialog("delete");
                            navigate("/admin/allusers")
                        }}
                        onCancel={() => closeDialog("delete")}
                    />
                </Modal>
            )}
            
            {/* Enable stockist */}
            <EnableStockistModal
                open={dialogs.enableStockist}
                user={user}
                onClose={() => {
                    closeDialog("enableStockist");
                }}
                isSubmitting={isEnabling}
                onConfirm={async ({ plan, location }) => {
                setIsEnabling(true);
                await confirmEnableStockist({
                    user: user,
                    plan,
                    location,
                    onFinally: () => {
                    setIsEnabling(false);
                    closeDialog("enableStockist");
                    },
                });
                }}
            />
            
            {/* Toggle account status */}
            {dialogs.toggleAccount && (
                <Modal
                onClose={() => {
                    closeDialog("toggleAccount");
                }}
                >
                <ConfirmationDialog
                    type="confirm"
                    title={`Confirm ${Number(user?.enabled) === 1 ? "deactivation" : "activation"}?`}
                    message={
                    <>
                        Are you sure you want to{" "}
                        {Number(user?.enabled) === 1 ? "deactivate" : "activate"}{" "}
                        <span className="font-semibold">{user?.username}</span>
                        's account?
                    </>
                    }
                    onConfirm={async () => {
                        await confirmToggleAccount(user);
                        closeDialog("toggleAccount");
                    }}
                    onCancel={() => {
                        closeDialog("toggleAccount");
                    }}
                />
                </Modal>
            )}
            
            {/* Upgrade user */}
            {dialogs.upgrade && (
                <Modal
                onClose={() => {
                    closeDialog("upgrade");
                }}
                >
                <ConfirmationDialog
                    type="confirm"
                    title="Confirm User Upgrade?"
                    message={
                    <>
                        Are you sure you want to upgrade{" "}
                        <span className="font-semibold">{user?.username}</span>? This
                        action might have irreversible effects.
                    </>
                    }
                    onConfirm={async () => {
                        await confirmUpgradeUser(user);
                        closeDialog("upgrade");
                    }}
                    onCancel={() => {
                        closeDialog("upgrade");
                    }}
                />
                </Modal>
            )}
            
            {/* Reset user credentials*/}
            {dialogs.resetCredentials && (
                <Modal
                    onClose={() => {
                        closeDialog("resetCredentials");
                    }}
                >
                <ConfirmationDialog
                    type="confirm"
                    title="Confirm credentials reset?"
                    message={
                    <>
                        Are you sure you want to reset{" "}
                        <span className="font-semibold">{user?.username}</span> password and pin back to default? This
                        action might have irreversible effects.
                    </>
                    }
                    onConfirm={async () => {
                        await confirmResetCredentials(user);
                        closeDialog("resetCredentials");
                    }}
                    onCancel={() => {
                        closeDialog("resetCredentials");
                    }}
                />
                </Modal>
            )}
        </>
    )
}

export default EachUser
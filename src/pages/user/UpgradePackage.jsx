import React, { useState, useEffect, useMemo } from 'react';
import { LuSparkle, LuCrown } from 'react-icons/lu';
import { AiOutlineRise } from 'react-icons/ai';
import { FaRegStar, FaLock } from 'react-icons/fa';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { CgArrowTopRight } from 'react-icons/cg';
import { VscGraph } from 'react-icons/vsc';
import { GiFire } from 'react-icons/gi';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext';
import { formatterUtility } from '../../utilities/formatterutility';
import { RxTrash } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { RiSubtractLine } from "react-icons/ri";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const packageIcons = {
  spark: LuSparkle,
  rise: AiOutlineRise,
  star: FaRegStar,
  super: IoShieldCheckmarkOutline,
  thrive: CgArrowTopRight,
  thrix: VscGraph,
  crown: LuCrown,
  default: GiFire,
};

const UpgradePackage = () => {
  const { user, token, logout, refreshUser } = useUser();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [upgradeDifference, setUpgradeDifference] = useState(0);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockists, setStockists] = useState([]);
  const [selectedStockist, setSelectedStockist] = useState('');
  const [isFetchingStockists, setIsFetchingStockists] = useState(false);

  const totalSelectedPrice = useMemo(() => {
    return selectedProducts.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  }, [selectedProducts]);

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [plansResponse, productsResponse, stockistsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/plans`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/allproducts`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/stockists`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (plansResponse.status === 200) {
          const fetchedPackages = plansResponse.data.data.data || [];
          setPackages(fetchedPackages);
          const current = fetchedPackages.find((pkg) => pkg.id === user.plan);
          setCurrentPackage(current || null);
        }

        if (productsResponse.status === 200) {
          setProducts(productsResponse.data.products || productsResponse.data);
        }

        if (stockistsResponse.status === 200 && stockistsResponse.data.success) {
          setStockists(stockistsResponse.data.data);
        }

      } catch (error) {
        console.error('Error fetching initial data:', error);
        if (error.response?.data?.message?.toLowerCase().includes('unauthenticated')) {
          logout();
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(error.response?.data?.message || 'Failed to load page data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInitialData();
    }
  }, [token, user?.plan, logout]);

  const handleSelectPackage = (pkg) => {
    const difference = Number(pkg.price) - Number(currentPackage?.price || 0);
    if (difference > Number(user.e_wallet)) {
      toast.error(
        `Insufficient balance: ${formatterUtility(Number(user.e_wallet))} available, ${formatterUtility(difference)} required.`
      );
      return;
    }
    setSelectedPackage(pkg);
    setUpgradeDifference(difference);
    setSelectedProducts([]); // Reset products when a new package is selected
    toast.success(`Selected ${pkg.name} package. You can now select products up to ${formatterUtility(difference)}.`);
  };

  const handleIncrement = (product) => {
    const newTotal = totalSelectedPrice + Number(product.price);
    if (newTotal > upgradeDifference) {
      toast.error("Total product value cannot exceed the upgrade amount.");
      return;
    }
    setSelectedProducts(prev => {
      const existingProduct = prev.find(item => item.id === product.id);
      if (existingProduct) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleDecrement = (product) => {
    setSelectedProducts(prev => {
      const existingProduct = prev.find(item => item.id === product.id);
      if (!existingProduct) return prev;
      if (existingProduct.quantity > 1) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item);
      } else {
        return prev.filter(item => item.id !== product.id);
      }
    });
  };

  const handleRemove = (product) => {
    setSelectedProducts(prev => prev.filter(item => item.id !== product.id));
    toast.success(`${product.product_name} removed from the list.`);
  };

  const getQuantity = (productId) => {
    return selectedProducts.find(item => item.id === productId)?.quantity || 0;
  };

  const handleFinalizeUpgrade = async () => {
    if (!selectedPackage) {
      toast.error('Please select a package to upgrade.');
      return;
    }
    if (!selectedStockist) {
      toast.error('Please select a stockist.');
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product.');
      return;
    }
    if (totalSelectedPrice > upgradeDifference) {
        toast.error('Total value of selected products exceeds the upgrade amount.');
        return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Processing upgrade...');

    const payload = {
      user_id: user.id,
      upgrade_plan_id: selectedPackage.id,
      stockist_id: selectedStockist,
      products: selectedProducts.map(p => ({ product_id: p.id, quantity: p.quantity }))
    };

    try {
      const response = await axios.post(`${API_URL}/api/upgrade-plan`, payload, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      // console.log("upgrade response", response)

      if (response.status === 200) {
        toast.success(`Successfully upgraded to ${selectedPackage.name} package!`, { id: toastId });
        setSelectedPackage(null);
        setSelectedProducts([]);
        setSelectedStockist('');
        setUpgradeDifference(0);
        await refreshUser();
        // Re-fetch packages to update current package display
        const plansResponse = await axios.get(`${API_URL}/api/plans`, { headers: { Authorization: `Bearer ${token}` } });
        if (plansResponse.status === 200) {
            const fetchedPackages = plansResponse.data.data.data || [];
            setPackages(fetchedPackages);
            const current = fetchedPackages.find((pkg) => pkg.id === user.plan);
            setCurrentPackage(current || null);
        }
      } else {
        throw new Error(response.data.message || 'Failed to upgrade package.');
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) logout();
      toast.error(error.response?.data?.message || 'Failed to upgrade package.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(product => product.repurchase === 0);

  return (
    <div className='space-y-6'>
      {/* Package Selection Section */}
      <div className="w-full bg-white shadow-sm rounded-lg p-4 md:p-6">
        <p className="font-semibold text-lg md:text-2xl mb-4">1. Choose a Plan to Upgrade</p>
        {isLoading ? (
          <div className="border-4 border-t-transparent animate-spin mx-auto rounded-full w-[50px] h-[50px]"></div>
        ) : (
          <div className="flex w-full overflow-x-auto scrollbar-hide gap-6 pb-4">
            {packages.map((pkg) => {
              const isCurrent = pkg.id === currentPackage?.id;
              const isDowngrade = Number(pkg.price) < Number(currentPackage?.price || 0);
              const difference = Number(pkg.price) - Number(currentPackage?.price || 0);
              const isInsufficient = difference > Number(user.e_wallet);
              const isDisabled = isCurrent || isDowngrade || isInsufficient;
              const Icon = packageIcons[pkg.name.toLowerCase()] || packageIcons.default;

              return (
                <div
                  key={pkg.id}
                  onClick={() => !isDisabled && handleSelectPackage(pkg)}
                  className={`min-w-80 relative overflow-hidden z-1 h-max rounded-3xl p-6 flex flex-col gap-3 bg-white text-black border-2 transition-all ${selectedPackage?.id === pkg.id ? 'border-pryClr' : 'border-black/10'} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
                  title={isDisabled ? (isCurrent ? 'This is your current package.' : isDowngrade ? 'Downgrading is not allowed.' : `Insufficient balance: ${formatterUtility(difference)} required.`) : ''}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold capitalize">{pkg.name} Package</p>
                    <Icon className={`text-3xl ${pkg.id % 2 === 0 ? 'text-accClr' : 'text-pryClr'}`} />
                  </div>
                  <p className={`font-bold text-4xl ${pkg.id % 2 === 0 ? 'text-accClr' : 'text-pryClr'}`}>{formatterUtility(Number(pkg.price))}</p>
                  <p className="text-sm">Point Value: {pkg.point_value}pv</p>
                  {isDisabled && <div className="absolute inset-0 bg-black/70 p-4 z-5 text-secClr font-bold text-lg flex items-center justify-center text-center"><FaLock className="mr-2" />{isCurrent ? 'Current Package' : isDowngrade ? 'Downgrade Not Allowed' : 'Insufficient Balance'}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product and Stockist Selection Section */}
      {selectedPackage && (
        <div className="w-full bg-white shadow-sm rounded-lg p-4 md:p-6 space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-2 border-b pb-4">
            <p className="text-lg md:text-xl font-bold text-gray-800">2. Select Products & Stockist</p>
            <div className='text-right'>
                <p className="font-semibold">Upgrade Amount: <span className="text-pryClr">{formatterUtility(upgradeDifference)}</span></p>
                <p className="font-semibold">Selected Total: <span className={`transition-colors ${totalSelectedPrice > upgradeDifference ? 'text-red-500' : 'text-green-500'}`}>{formatterUtility(totalSelectedPrice)}</span></p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {loading ? (
              <div className="border-4 border-t-transparent animate-spin mx-auto rounded-full w-[50px] h-[50px]"></div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-2 p-2 border border-black/10 rounded-lg">
                  <img src={`${IMAGE_BASE_URL}/${product.product_image}`} alt={product.product_name} className="w-16 h-16 object-cover rounded-md bg-gray-100" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-pryClr">{product.product_name}</h4>
                    <p className='text-sm'>{formatterUtility(Number(product.price))}</p>
                  </div>
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button type="button" onClick={() => handleDecrement(product)} className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"><RiSubtractLine /></button>
                    <p className="border-x border-black w-10 h-8 flex items-center justify-center font-semibold">{getQuantity(product.id)}</p>
                    <button type="button" onClick={() => handleIncrement(product)} className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-100"><GoPlus /></button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products available for upgrade.</p>
            )}
          </div>

          {selectedProducts.length > 0 && (
            <div className="border-t pt-4 mt-4 space-y-2">
              <h3 className='text-lg font-bold'>Your Selection Summary</h3>
              {selectedProducts.map((product) => (
                <div key={product.id} className='flex items-center justify-between p-2 rounded-lg bg-pryClr/5'>
                  <p className='font-semibold'>{product.product_name} ({product.quantity}x)</p>
                  <p className='font-bold'>{formatterUtility(Number(product.price) * product.quantity)}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            <label htmlFor='stockist' className='text-sm font-medium text-gray-700 mb-1'>Select Stockist</label>
            <select id='stockist' name='stockist' value={selectedStockist} onChange={(e) => setSelectedStockist(e.target.value)} disabled={isFetchingStockists} className='h-12 px-4 py-2 border rounded-lg w-full focus:ring-pryClr focus:border-pryClr disabled:cursor-not-allowed disabled:opacity-50'>
              <option value='' disabled>Select a stockist</option>
              {stockists.map((item) => <option key={item.id} value={item.id}>{item?.username} ({item?.stockist_location})</option>)}
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button 
              onClick={handleFinalizeUpgrade} 
              disabled={isSubmitting || !selectedStockist || selectedProducts.length === 0 || totalSelectedPrice > upgradeDifference} 
              className='px-8 py-3 bg-pryClr text-secClr font-semibold rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accClr'
            >
              {isSubmitting ? 'Upgrading...' : 'Finalize Upgrade'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpgradePackage;

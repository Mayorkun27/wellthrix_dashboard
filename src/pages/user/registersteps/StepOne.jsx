import React, { useEffect, useState, useCallback } from 'react';
import { LuSparkle, LuCrown } from 'react-icons/lu';
import { AiOutlineRise } from 'react-icons/ai';
import { FaLock, FaRegStar } from 'react-icons/fa';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';
import { CgArrowTopRight } from 'react-icons/cg';
import { VscGraph } from 'react-icons/vsc';
import { FiSearch } from 'react-icons/fi';
import { GiFire } from 'react-icons/gi';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../../context/UserContext';
import { formatterUtility } from '../../../utilities/Formatterutility';
import { debounce } from 'lodash';

const API_URL = import.meta.env.VITE_API_BASE_URL;

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

const StepOne = ({ nextStep, formData, updateFormData }) => {
  const { user, token, logout } = useUser();
  const [selectedPackage, setSelectedPackage] = useState(formData.selectedPackage || null);
  const [sponsor, setSponsor] = useState(formData.sponsor?.username || '');
  const [sponsorId, setSponsorId] = useState(formData.sponsor?.id || null);
  const [placement, setPlacement] = useState(formData.placement?.username || '');
  const [placementId, setPlacementId] = useState(formData.placement?.id || null);
  const [leg, setLeg] = useState(formData.leg || '');
  const [availableLegs, setAvailableLegs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSponsor, setIsFetchingSponsor] = useState(false);
  const [isFetchingPlacement, setIsFetchingPlacement] = useState(false);
  const [isFetchingLegs, setIsFetchingLegs] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [packages, setPackages] = useState([]);
  const [sponsorResults, setSponsorResults] = useState([]);
  const [placementResults, setPlacementResults] = useState([]);
  const [errors, setErrors] = useState({ sponsor: '', placement: '', leg: '', package: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackages();
  }, [token]);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/plans`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (response.status === 200) {
        setPackages(response.data.data.data || []);
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) logout();
      toast.error(error.response?.data?.message || 'Failed to fetch packages.');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSponsorsAndDownlines = useCallback(
    debounce(async (searchTerm, type = 'sponsor', sponsorId = null) => {
      if (!searchTerm) {
        type === 'sponsor' ? setSponsorResults([]) : setPlacementResults([]);
        return;
      }
      type === 'sponsor' ? setIsFetchingSponsor(true) : setIsFetchingPlacement(true);
      try {
        const params = { search: searchTerm };
        if (type === 'placement' && sponsorId) {
          params.sponsor_id = sponsorId;
        }
        const response = await axios.get(`${API_URL}/api/referrals/downlines`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          params,
        });
        console.log("downline", response)
        if (response.status === 200) {
          const results = response.data.data || [];
          type === 'sponsor' ? setSponsorResults(results) : setPlacementResults(results);
        }
      } catch (error) {
        if (error.response?.data?.message?.includes('unauthenticated')) logout();
        toast.error(error.response?.data?.message || `Failed to fetch ${type}s.`);
      } finally {
        type === 'sponsor' ? setIsFetchingSponsor(false) : setIsFetchingPlacement(false);
      }
    }, 500),
    [token, logout]
  );

  const fetchAvailableLegs = async (placementId) => {
    if (!placementId) return;
    setIsFetchingLegs(true);
    try {
      const response = await axios.get(`${API_URL}/api/referrals/available-legs?placement_id=${placementId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      console.log("fetchAvailableLegs", response)
      if (response.status === 200) {
        setAvailableLegs(response.data.data || []);
        console.log("response.data.data", response.data.data)
        // Reset leg if it's not in the available legs
        if (leg && !response.data.data.includes(leg)) {
          setLeg('');
          updateFormData({ leg: '' });
        }
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) logout();
      toast.error(error.response?.data?.message || 'Failed to fetch available legs.');
      setAvailableLegs([]);
      setLeg('');
      updateFormData({ leg: '' });
    } finally {
      setIsFetchingLegs(false);
    }
  };

  const handleSelectPackage = (pkg) => {
    if (Number(pkg.price) > Number(user.e_wallet)) {
      toast.error(`Insufficient balance: ${formatterUtility(Number(user.e_wallet))} available, ${formatterUtility(Number(pkg.price))} required.`);
      setErrors((prev) => ({ ...prev, package: 'Package price exceeds your e-wallet balance.' }));
      return;
    }
    setSelectedPackage(pkg);
    updateFormData({ selectedPackage: pkg });
    setErrors((prev) => ({ ...prev, package: '' }));
  };

  const handleSponsorSelect = (user) => {
    setSponsor(user.username);
    setSponsorId(user.id);
    setSponsorResults([]);
    setPlacement('');
    setPlacementId(null);
    setPlacementResults([]);
    setAvailableLegs([]);
    setLeg('');
    updateFormData({ sponsor: { id: user.id, username: user.username }, placement: null, leg: '' });
    setErrors((prev) => ({ ...prev, sponsor: '', placement: '', leg: '' }));
  };

  const handlePlacementSelect = (user) => {
    setPlacement(user.username);
    setPlacementId(user.id);
    setPlacementResults([]);
    updateFormData({ placement: { id: user.id, username: user.username } });
    setErrors((prev) => ({ ...prev, placement: '' }));
    fetchAvailableLegs(user.id);
  };

  const handleRegInit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Initializing registration...');
    try {
      let newSessionId = currentSessionId;
      if (!newSessionId) {
        const response = await axios.post(
          `${API_URL}/api/registration/initiate`,
          {},
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        if (response.status === 200 && response.data.success) {
          newSessionId = response.data.session_id;
          if (!newSessionId) throw new Error('Session ID not provided by server.');
          setCurrentSessionId(newSessionId);
        } else {
          throw new Error(response.data.message || 'Failed to initialize registration.');
        }
      }
      toast.success('Registration initialized successfully!', { id: toastId });
      await handleSubmit(newSessionId);
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) logout();
      toast.error(error.response?.data?.message || 'Failed to initialize registration.', { id: toastId });
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (sessionIdFromInit) => {
    const toastId = toast.loading('Processing step one...');
    if (!sessionIdFromInit) {
      toast.error('Session ID is required.', { id: toastId });
      setIsSubmitting(false);
      return;
    }
    try {
      const dataToSubmit = {
        plan: selectedPackage.id,
        leg,
        sponsor: sponsorId,
        placement: placementId,
        sessionId: sessionIdFromInit,
      };
      const response = await axios.post(`${API_URL}/api/registration/step-1`, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Session-ID': sessionIdFromInit,
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message || 'Step 1 completed successfully!', { id: toastId });
        updateFormData({
          selectedPackage,
          leg,
          sponsor: { id: sponsorId, username: sponsor },
          placement: { id: placementId, username: placement },
        });
        nextStep(sessionIdFromInit);
      } else {
        throw new Error(response.data.message || 'Failed to submit Step 1.');
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('unauthenticated')) logout();
      toast.error(error.response?.data?.message || 'Failed to submit Step 1.', { id: toastId });
      setIsSubmitting(false);
    }
  };

  const handlePositionSelection = (selection) => {
    if (availableLegs.available_legs.includes(selection)) {
      setLeg(selection);
      updateFormData({ leg: selection });
      setErrors((prev) => ({ ...prev, leg: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = { sponsor: '', placement: '', leg: '', package: '' };
    let isValid = true;
    if (!sponsorId) {
      newErrors.sponsor = 'Please select a valid sponsor.';
      isValid = false;
    }
    if (!placementId) {
      newErrors.placement = 'Please select a valid placement.';
      isValid = false;
    }
    if (!leg || !availableLegs.available_legs.includes(leg)) {
      newErrors.leg = 'Please select a valid position.';
      isValid = false;
    }
    if (!selectedPackage) {
      newErrors.package = 'Please select a package.';
      isValid = false;
    } else if (Number(selectedPackage.price) > Number(user.e_wallet)) {
      newErrors.package = 'Package price exceeds your e-wallet balance.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const isFormValid = selectedPackage &&
    Number(selectedPackage.price) <= Number(user.e_wallet) &&
    leg &&
    availableLegs.available_legs.includes(leg) &&
    sponsorId &&
    placementId;

  return (
    <div className="w-full flex flex-col gap-4 mt-6">
      <div className="w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6">
        <p className="text-2xl font-bold text-gray-800">Sponsor</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="relative">
            <label htmlFor="sponsor" className="block text-lg md:text-2xl font-medium mb-2">
              Sponsor
            </label>
            <div className="relative">
              <input
                type="text"
                id="sponsor"
                name="sponsor"
                placeholder="Search for a sponsor"
                className={`block w-full h-12 indent-3 pr-13 py-2 border rounded-lg outline-0 ${
                  errors.sponsor ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={(e) => {
                  const value = e.target.value.replace(/^@/, '');
                  setSponsor(value);
                  setSponsorId(null);
                  debouncedFetchSponsorsAndDownlines(value, 'sponsor');
                }}
                value={sponsor ? `@${sponsor}` : ''}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-1 w-[45px] h-[90%] top-1/2 -translate-y-1/2 rounded-lg flex bg-pryClr items-center justify-center cursor-pointer"
              >
                <FiSearch className="text-secClr text-xl" />
              </button>
              {errors.sponsor && <p className="text-red-500 text-sm mt-1">{errors.sponsor}</p>}
            </div>
            {isFetchingSponsor && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
            {!isFetchingSponsor && sponsorResults.length > 0 && (
              <ul className="mt-2 rounded-sm bg-white max-h-40 overflow-y-auto styled-scrollbar shadow-xl border border-gray-200 absolute z-10 w-full">
                {sponsorResults.map((result) => (
                  <li
                    key={result?.user.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSponsorSelect(result.user)}
                  >
                    @{result?.user.username} ({result?.user.fullname})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative">
            <label htmlFor="placement" className="block text-lg md:text-2xl font-medium mb-2">
              Placement
            </label>
            <div className="relative">
              <input
                type="text"
                id="placement"
                name="placement"
                placeholder="Search for placement"
                className={`block w-full h-12 indent-3 pr-13 py-2 border rounded-lg outline-0 ${
                  errors.placement ? 'border-red-500' : 'border-gray-300'
                } ${!sponsorId ? 'opacity-50 cursor-not-allowed' : ''}`}
                onChange={(e) => {
                  const value = e.target.value.replace(/^@/, '');
                  setPlacement(value);
                  setPlacementId(null);
                  debouncedFetchSponsorsAndDownlines(value, 'placement', sponsorId);
                }}
                disabled={!sponsorId}
                value={sponsorId ? (placement ? `@${placement}` : '') : 'Enter sponsor first'}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-1 w-[45px] h-[90%] top-1/2 -translate-y-1/2 rounded-lg flex bg-pryClr items-center justify-center cursor-pointer"
              >
                <FiSearch className="text-secClr text-xl" />
              </button>
              {errors.placement && <p className="text-red-500 text-sm mt-1">{errors.placement}</p>}
            </div>
            {isFetchingPlacement && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
            {!isFetchingPlacement && placementResults.length > 0 && (
              <ul className="mt-2 rounded-sm bg-white max-h-40 overflow-y-auto styled-scrollbar shadow-xl border border-gray-200 absolute z-10 w-full">
                {placementResults.map((result) => (
                  <li
                    key={result.user.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePlacementSelect(result.user)}
                  >
                    @{result.user.username} ({result.user.fullname})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="relative lg:col-span-1 md:col-span-2">
            <label htmlFor="position" className="block text-lg md:text-2xl font-medium mb-2">
              Position
            </label>
            <div className="relative flex items-center gap-6">
              <button
                type="button"
                disabled={!sponsorId || !placementId || !availableLegs?.can_place_left || isFetchingLegs}
                onClick={() => handlePositionSelection('left')}
                className={`w-full h-12 border-2 border-pryClr rounded-lg transition-all duration-500 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed ${
                  leg === 'left' ? 'bg-pryClr text-secClr' : 'bg-transparent text-black'
                }`}
              >
                Left
              </button>
              <button
                type="button"
                disabled={!sponsorId || !placementId || !availableLegs?.can_place_right || isFetchingLegs}
                onClick={() => handlePositionSelection('right')}
                className={`w-full h-12 border-2 border-pryClr rounded-lg transition-all duration-500 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed ${
                  leg === 'right' ? 'bg-pryClr text-secClr' : 'bg-transparent text-black'
                }`}
              >
                Right
              </button>
            </div>
            {isFetchingLegs && <p className="text-sm text-gray-500 mt-2">Fetching available positions...</p>}
            {errors.leg && <p className="text-red-500 text-sm mt-1">{errors.leg}</p>}
            {availableLegs.length === 0 && placementId && !isFetchingLegs && (
              <p className="text-red-500 text-sm mt-1">No available positions for this placement.</p>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleRegInit}
        className="w-full flex flex-col gap-4 md:gap-6 rounded-2xl bg-white shadow-xl px-4 md:px-6 py-6"
      >
        <p className="text-xl md:text-2xl font-bold text-gray-800">Pick Your Package</p>
        <div className="">
          {isLoading ? (
            <div className="border-4 border-t-transparent animate-spin mx-auto rounded-full w-[100px] h-[100px]"></div>
          ) : (
            <div className="flex w-full overflow-x-auto scrollbar-hide gap-6 pb-4">
              {packages.map((pkg, index) => {
                const Icon = packageIcons[pkg.name.toLowerCase()] || packageIcons.default;
                const isDisabled = Number(pkg.price) > Number(user.e_wallet);
                return (
                  <div
                    key={pkg.id}
                    onClick={() => !isDisabled && handleSelectPackage(pkg)}
                    className={`
                      min-w-80 relative overflow-hidden z-1 h-max rounded-3xl p-6 flex flex-col gap-3 bg-white text-black
                      border-2 ${selectedPackage?.id === pkg.id ? 'border-pryClr' : 'border-black/10'}
                      transition-all ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
                    `}
                    aria-disabled={isDisabled}
                    title={isDisabled ? `Insufficient balance: ${formatterUtility(Number(user.e_wallet))} available` : ''}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold capitalize">{pkg.name} Package</p>
                      <Icon className={`text-3xl ${index % 2 === 0 ? 'text-accClr' : 'text-pryClr'}`} />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <p className={`font-bold text-4xl ${index % 2 === 0 ? 'text-accClr' : 'text-pryClr'}`}>
                        {formatterUtility(Number(pkg.price))}
                        <span className="text-base font-normal"> NGN</span>
                      </p>
                      <p className="text-sm">Point Value: {pkg.point_value}pv</p>
                    </div>
                    {
                      isDisabled && (
                        <div className='absolute inset-0 bg-black/70 p-6 z-5 text-secClr font-bold text-xl opacity-100 flex flex-col gap-2 items-center justify-center text-center'>
                          <FaLock className='size-10' />
                          <h3 className='leading-5'>Insufficient balance: <span className='text-accClr'>{formatterUtility(Number(user.e_wallet))}</span> available</h3>
                        </div>
                      )
                    }
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {errors.package && <p className="text-red-500 text-sm mt-1">{errors.package}</p>}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-xl bg-black hover:bg-black/80 rounded-lg cursor-pointer text-secClr px-6 py-3 transition-colors"
            aria-label="Go back to previous page"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`
              text-xl bg-pryClr rounded-xl text-white px-6 py-3 transition-colors
              ${!isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pryClrDark'}
            `}
            aria-label="Submit and proceed to next step"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                Loading...
              </span>
            ) : (
              'Next'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepOne;
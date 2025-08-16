import React, { useEffect, useRef, useState } from 'react'
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { CiMaximize1, CiMinimize1 } from "react-icons/ci";
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Network = () => {
  const { user, token, logout } = useUser()
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('all');
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));
  const [canvaScale, setCanvaScale] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStepsSummary = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_URL}/api/referrals/genealogy-tree`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      console.log("Genealogy response", response)

      if (response.status === 200) {
        setReferralData(response.data.data)
        toast.success(response.data.message || "Genealogy data fetched successfully.");
      } else {
        throw new Error(response.data.message || "Genealogy data call failed.");
      }
    } catch (error) {
      if (error.response?.data?.message?.includes("unauthenticated")) {
        logout();
      }
      console.error("An error occured fetching genealogy data:", error);
      toast.error(error.response?.data?.message || "An error occurred fetching genealogy data.");
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 2000);
    }
  }

  useEffect(() => {
    fetchStepsSummary()
  }, [token])

  const canvaRef = useRef(null);

  const handleCanvaScaleReduction = () => {
    if (canvaScale > 10) {
      setCanvaScale(canvaScale - 10);
    }
  };

  const handleCanvaScaleIncrement = () => {
    if (canvaScale < 100) {
      setCanvaScale(canvaScale + 10);
    }
  };

  const handleMaximize = () => {
    if (!document.fullscreenElement) {
        // If not in full screen, request full screen for the canvaRef element
        if (canvaRef.current) {
            canvaRef.current.requestFullscreen().then(() => {
                setIsFullScreen(true);
            });
        }
    } else {
        // If in full screen, exit full screen
        document.exitFullscreen().then(() => {
            setIsFullScreen(false);
        });
    }
  };

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const filterByGeneration = (node, generation) => {
    if (generation === 'all') return true;
    return node.generation === parseInt(generation);
  };

  const searchInTree = (node, term) => {
    if (!term) return true;
    return node.name.toLowerCase().includes(term.toLowerCase()) ||
           node.id.toLowerCase().includes(term.toLowerCase());
  };

  const ReferralCard = ({ user, isExpanded, onToggle, hasChildren }) => (
    <div className={`bg-white thiscard rounded-xl transition-all duration-300 py-3 w-[200px] relative text-sm`}>
      <div className="flex flex-col items-center">
        <div className="md:w-11 w-10 md:h-11 h-10 mb-2 rounded-full border-2 border-pryClr bg-pryClr/20 overflow-hidden uppercase font-bold flex items-center justify-center">
          <h3>{`${user?.fullname?.split(" ")[0].split("")[0]}${user?.fullname?.split(" ")[1].split("")[0]}`}</h3>
        </div>
        <h3 className="font-semibold text-black/80 text-center my-2 leading-0">@{user.username}</h3>
        <small className="flex items-center gap-2 font-semibold text-pryClr">
          <span>Left: {user.left_count}</span>
          <hr className='h-3 border-0 border-r-2' />
          <span>Right: {user.right_count}</span>
        </small>
        {isExpanded && <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 w-[2px] h-8 bg-black -z-1"></div>}
        {hasChildren && (
          <button
            onClick={() => onToggle(user.id)}
            className={`mt-2 p-2 rounded-lg bg-pryClr text-white hover:shadow-md transition-all duration-200`}
          >
            {isExpanded ? <BsChevronDown size={16} /> : <BsChevronRight size={16} />}
          </button>
        )}
      </div>
    </div>
  );

  const TreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.left || node.right; // Check for left OR right child
    
    const shouldShow = filterByGeneration(node, selectedGeneration) && searchInTree(node, searchTerm);

    if (!shouldShow) return null;

    if (isLoading) {
      return <div className='w-10 h-10 border-4 border-pryClr border-t-transparent rounded-full animate-spin'></div>
    }

    return (
      <div className="relative flex flex-col items-center">
        
        {/* The Referral Card */}
        <div className={`relative z-20 flex flex-col items-center`}>
          <ReferralCard
            user={node}
            isExpanded={isExpanded}
            onToggle={toggleNode}
            hasChildren={hasChildren}
          />
        </div>

        {/* Children Container */}
        {isExpanded && hasChildren && (
          <div className={`${node.left && node.right ? "mt-12" : "mt-7"} flex gap-8 items-start justify-center relative`}>

            {/* Conditionally render the left child */}
            {node.left && (
              <div className={`relative z-20 flex flex-col items-center children-card ${node.right ? "left-card" : ""}`}>
                <TreeNode node={node.left} level={level + 1} />
              </div>
            )}

            {/* Conditionally render the right child */}
            {node.right && (
              <div className={`relative z-20 flex flex-col items-center children-card ${node.left ? "right-card" : ""}`}>
                <TreeNode node={node.right} level={level + 1} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={canvaRef} className='bg-white rounded-xl shadow-md p-8 h-[calc(100dvh-(44px+16px+48px))] mb-2 overflow-auto no-scrollbar'>
      <div 
        className={`w-fit min-w-full mx-auto ${isLoading && "w-full h-full flex items-center justify-center"}`}
        style={{ transform: `scale(${canvaScale / 100})`, transformOrigin: 'top center' }}
      >
        {referralData && <TreeNode node={referralData} />}
      </div>
      <div className="absolute w-max right-5 bottom-5 flex bg-gray-100 border border-black/20 rounded-md overflow-hidden">
        <button
          type='button'
          className='w-10 h-10 flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer'
          title='Decrease canva size'
          disabled={canvaScale === 30}
          onClick={handleCanvaScaleReduction}
        >
          <FaMinus />
        </button>
        <button
          type='button'
          className='w-10 h-10 text-xs flex items-center justify-center border-x border-black/20 cursor-pointer'
          title='Increase canva size'
          disabled
        >
          {canvaScale + "%"}
        </button>
        <button
          type='button'
          className='w-10 h-10 flex items-center justify-center border-x border-black/20 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer'
          title='Increase canva size'
          disabled={canvaScale === 100}
          onClick={handleCanvaScaleIncrement}
        >
          <FaPlus />
        </button>
        <button
          type='button'
          className='w-10 h-10 flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer font-extrabold'
          title={`${isFullScreen ? "Minimize" : "Maximize"} canva`}
          onClick={handleMaximize}
        >
          {!isFullScreen ? <CiMaximize1 /> : <CiMinimize1 />}
        </button>
      </div>
    </div>
  )
}

export default Network
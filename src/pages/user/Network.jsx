import React, { useRef, useState } from 'react'
import { BsChevronDown, BsChevronRight } from 'react-icons/bs';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { CiMaximize1, CiMinimize1 } from "react-icons/ci";

const Network = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('all');
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root']));
  const [canvaScale, setCanvaScale] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const referralData = {
    id: 'root',
    name: 'John Smith',
    generation: 0,
    earnings: 15420,
    totalReferrals: 24,
    children: [
      {
        id: 'ref1',
        name: 'Sarah Johnson',
        generation: 1,
        earnings: 8750,
        totalReferrals: 12,
        children: [
          {
            id: 'ref1-1',
            name: 'Mike Chen',
            generation: 2,
            earnings: 3200,
            totalReferrals: 5,
            children: [
              {
                id: 'ref1-1-1',
                name: 'Lisa Wang',
                generation: 3,
                earnings: 1800,
                totalReferrals: 3,
                children: [
                  {
                    id: 'ref1-1-1-1',
                    name: 'David Kim',
                    generation: 4,
                    earnings: 950,
                    totalReferrals: 0,
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: 'ref1-2',
            name: 'Emma Davis',
                        generation: 2,
            earnings: 2900,
            totalReferrals: 4,
            children: []
          }
        ]
      },
      {
        id: 'ref2',
        name: 'Robert Wilson',
        generation: 1,
        earnings: 6200,
        totalReferrals: 8,
        children: [
          {
            id: 'ref2-1',
            name: 'Anna Martinez',
            generation: 2,
            earnings: 4100,
            totalReferrals: 6,
            children: []
          },
          {
            id: 'ref2-1',
            name: 'James Brown',
            generation: 1,
            earnings: 3800,
            totalReferrals: 4,
            children: []
          }
        ]
      },
    ]
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
    <div className={`bg-white thiscard rounded-xl transition-all duration-300 py-3 w-[200px] relative`}>
      <div className="flex flex-col items-center">
        <div className="md:w-11 w-10 md:h-11 h-10 rounded-full border-2 border-pryClr bg-pryClr/20 overflow-hidden capitalize font-semibold flex items-center justify-center">
          <h3>{`${user.name.split(" ")[0].split("")[0]}${user.name.split(" ")[1].split("")[0]}`}</h3>
        </div>
        <h3 className="font-semibold text-gray-800 text-center my-2">{user.name}</h3>
        {isExpanded && <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 w-[2px] h-8 bg-black -z-1"></div>}
        {hasChildren && (
          <button
            onClick={() => onToggle(user.id)}
            className={`mt-4 p-2 rounded-lg bg-pryClr text-white hover:shadow-md transition-all duration-200`}
          >
            {isExpanded ? <BsChevronDown size={16} /> : <BsChevronRight size={16} />}
          </button>
        )}
      </div>
    </div>
  );

  const TreeNode = ({ node, level = 0 }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const shouldShow = filterByGeneration(node, selectedGeneration) && searchInTree(node, searchTerm);

    if (!shouldShow) return null;

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
          <div className="mt-12 flex gap-8 items-start justify-center relative">
            {node.children.map((child, index) => (
              <div
                key={child.id}
                className={`relative z-20 flex flex-col items-center children-card ${
                  node.children.length === 2 && index === 0 ? "left-card" : 
                  node.children.length === 2 && index === 1 ? "right-card" : 
                  "-mt-6"
                }`}
              >
                <TreeNode node={child} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>

    );
  };

  return (
    <div ref={canvaRef} className='bg-white rounded-xl shadow-md p-8 h-[calc(100dvh-(44px+16px+48px))] mb-2 overflow-auto no-scrollbar'>
      <div 
        className={`w-fit min-w-full mx-auto`}
        style={{ transform: `scale(${canvaScale / 100})`, transformOrigin: 'top center' }}
      >
        <TreeNode node={referralData} />
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
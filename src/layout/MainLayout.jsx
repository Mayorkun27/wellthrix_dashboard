import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from 'react-router-dom';
import LeftNav from '../components/navs/LeftNav';
import TopNav from '../components/navs/TopNav';
import { HiBars3 } from 'react-icons/hi2';
import { FaXmark } from 'react-icons/fa6';

const MainLayout = ({ child, pageName, subText }) => {
  useEffect(() => {
    document.title = 'Wellthrix International - ' + pageName
  }, [pageName])
    
  const location = useLocation();
  const mainContentRef = useRef(null);

  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const style = document.createElement('style');
    style.textContent = `
      .main-content {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        overflow-anchor: none;
        scroll-padding-top: 80px;
        overscroll-behavior-y: contain;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      setTimeout(() => {
        if (mainContentRef.current?.scrollTop !== 0) {
          mainContentRef.current?.scrollTo(0, 0);
        }
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      }, 300);
    };

    const rafId = requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (pageName === 'Transactions') {
      // setSelectedType("E-Wallet");
      setSelectedType("Earnings History");
    } else if (pageName === 'Recharge History') {
      setSelectedType("Airtime");
    }
  }, [pageName]);

  return (
    <div className='flex w-ful !relative h-[100dvh] overflow-hidden'>
      <div
        className={`lg:w-1/4 z-100 bg-black/50 h-full w-full lg:sticky absolute transition-all duration-500 ${isOpen ? "left-0 opacity-100" : "-left-full lg:opacity-100 opacity-0"}`}
      >
        <button
          type='button'
          className='lg:hidden top-4 lg:left-[70%] md:left-[53%] right-[5%] block absolute text-secClr'
          onClick={() => setIsOpen(false)}
        >
          <FaXmark size={30} />
        </button>
        <LeftNav setIsOpen={setIsOpen} />
      </div>

      <div className='lg:w-3/4 w-full overflow-hidden bg-pryClr/20 pt-4'>
        <div className="flex gap-2 sticky top-0 z-10 md:items-center items-start md:px-6 px-4">
          <button
            type='button'
            className='lg:hidden inline-block mt-1'
            onClick={() => setIsOpen(true)}
          >
            <HiBars3 size={30} />
          </button>

          <TopNav
            pageName={pageName}
            subText={subText}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
          />
        </div>

        <div
          ref={mainContentRef}
          className="my-6 lg:pb-10 md:h-[calc(100%-10vh)] h-[calc(100%-(10vh+10px))] overflow-y-scroll no-scrollbar"
          style={{
            minHeight: '0',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorY: 'contain'
          }}
          tabIndex={-1}
        >
          <AnimatePresence mode="wait">
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              className='made-container overflow-x-hidden'
              variants={pageVariants}
              style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}
            >
              {/* This is the key line to render the child component */}
              {React.cloneElement(child, { selectedType, setSelectedType })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
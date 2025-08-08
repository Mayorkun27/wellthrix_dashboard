import React, { useState } from 'react';
import assets from '../../assets/assests';
import AirtimePurchase from '../digitalpurchases/AirtimePurchase';
import DataPurchase from '../digitalpurchases/DataPurchase';
import ElectricityPurchase from '../digitalpurchases/ElectricityPurchase';
import Modal from '../../components/modals/Modal';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL

const Digital = () => {
  const [selectedDigitalProduct, setSelectedDigitalProduct] = useState("airtime");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [formData, setFormData] = useState(null);
  const [isloading, setIsLoading] = useState(false)

  const { logout, token } = useUser();
  const navigate = useNavigate()

  const digitalProducts = [
    { 
      type: "airtime", 
      image: assets.digitalproduct1, 
      name: "Buy Airtime",
    },
    { 
      type: "data", 
      image: assets.digitalproduct2, 
      name: "Buy Data Bundle",
    },
    { 
      type: "electricity", 
      image: assets.digitalproduct3, 
      name: "Pay Electricity Bill",
    },
  ];

  const handlePinChange = (index, value) => {
    if (value === '' || /^[0-9]$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`).focus();
      }
    }
  };

  const isPinComplete = pin.every(digit => digit !== '');

  const handleOpenPinModal = (data) => {
    setFormData(data);
    setShowPinModal(true);
  };

  const handleTransactionSubmit = async () => {
    const toastId = toast.loading(`Processing ${formData.serviceID} purchase...`)
    if (isPinComplete) {
      setIsLoading(true)
      console.log('Final Submission Data:', { ...formData, pin: pin.join('')});
      
      try {
        const response = await axios.post(`${API_URL}/api/airtime`, { ...formData, pin: pin.join('')}, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        console.log("transaction response", response)

        if (response.status === 200) {
          toast.success(response.data.message || `${formData.serviceID} Purchase successful`, { id: toastId })
          setTimeout(() => {
            navigate("/user/rechargehistory")
          }, 2000)
        }
      } catch (error) {
        if (error.response.data.message.toLowerCase() == "unauthenticated") {
          logout()
        }
        console.error("An error occured initiating transaction", error)
        toast.error(error.response.data.message || "An error occured initiating transaction", { id: toastId })
      } finally {
        setShowPinModal(false);
        setPin(['', '', '', '']);
        setFormData(null);
        setIsLoading(false)
      }
    }
  };

  const renderDigitalPurchaseForm = () => {
    switch (selectedDigitalProduct) {
      case "airtime":
        return <AirtimePurchase onProceed={handleOpenPinModal} />;
      case "data":
        return <DataPurchase onProceed={handleOpenPinModal} />;
      case "electricity":
        return <ElectricityPurchase onProceed={handleOpenPinModal} />;
      default:
        return null;
    }
  };

  return (
    <div className='space-y-6 pb-2'>
      <div className="flex gap-4 overflow-x-scroll styled-scrollbar pb-3">
        {digitalProducts.map((digitalProduct, index) => (
          <div key={index} className="lg:w-[calc(100%/3)] md:min-w-2/5 lg:min-w-max min-w-10/12">
            <button 
              onClick={() => setSelectedDigitalProduct(digitalProduct.type)}
              className={`shadow-md rounded-xl p-3 overflow-hidden w-full cursor-pointer focus:bg-pryClr space-y-2 ${selectedDigitalProduct === digitalProduct.type ? "bg-pryClr" : "bg-white"} transition-all duration-300`}
            >
              <div className={`w-full h-[100px] rounded-lg flex items-center justify-center ${selectedDigitalProduct === digitalProduct.type ? "bg-white" : "bg-pryClr/15"}`}>
                <img src={digitalProduct.image} alt={digitalProduct.name+" image"} className='w-[90%] h-[90%] object-scale-down mx-auto' />
              </div>
              <div className="flex flex-col justify-between items-start">
                <h3 className={`font-semibold md:text-lg text-base ${selectedDigitalProduct === digitalProduct.type ? "text-white" : "text-pryClr"}`}>{digitalProduct.name}</h3>
              </div>
            </button>
          </div>
        ))}
      </div>
      
      {selectedDigitalProduct && (
        <div className="bg-pryClr/40 w-full rounded-xl shadow-md md:p-6 p-4">
          {renderDigitalPurchaseForm()}
        </div>
      )}

      {showPinModal && (
        <Modal onClose={() => setShowPinModal(false)}>
          <div className='w-full text-center'>
            <h3 className='text-2xl font-bold'>Confirm Transaction</h3>
            <p className='md:text-base text-xs'>Enter your pin to complete this transaction</p>
            <div className="w-full flex justify-center md:gap-8 gap-4 px-4 mt-8">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pin[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  className="w-14 h-14 md:w-16 md:h-16 bg-[#D9D9D9] rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-[#2F5318] border border-gray-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !e.target.value && index > 0) {
                      document.getElementById(`pin-input-${index - 1}`).focus();
                    }
                  }}
                  id={`pin-input-${index}`}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <button
              onClick={handleTransactionSubmit}
              disabled={!isPinComplete || isloading}
              className={`mt-8 bg-pryClr text-secClr font-medium lg:w-1/2 w-full h-[50px] rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isloading ? "Confirming..." : "Confirm"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Digital;
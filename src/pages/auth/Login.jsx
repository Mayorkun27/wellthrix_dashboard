import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import { FaFaceRollingEyes } from 'react-icons/fa6';
import { PiSmileyXEyesFill } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext';

const API_URL = import.meta.env.VITE_API_BASE_URL

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { logout, login, refreshUser } = useUser()

  const navigate = useNavigate()
  
  // Formik + Yup Setup
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Login submitted:', values, 'Remember Me:', rememberMe);
      try {
        const response = await axios.post(`${API_URL}/api/login`, values, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        console.log("response", response)

        // if (response.status === 200) {
        //     const { token, role } = response.data
        //     localStorage.setItem("token", token)
        //     await refreshUser(token)
        //     // const encrypted = encryptToken(token);
        //     // login(token, user);
        //     toast.success('Login successful');
        //     setTimeout(() => {
        //         toast("Redirecting to dashboard...");
        //         setTimeout(() => {
        //             role === "admin" ? navigate(`/user/overview`) : navigate('/user/overview');
        //         }, 2000);
        //     }, 1000);
        // }  

       if (response.status === 200) {
          const { token } = response.data;
          await login(token);

          toast.success('Login successful');
          setTimeout(() => {
            toast("Redirecting to dashboard...");
            setTimeout(() => {
              navigate('/user/overview');
            }, 2000);
          }, 1000);
        }
      } catch (err) {
        console.error('Error during logging in:', err);
        if (axios.isAxiosError(err) && err.response && err.response.status === 401) {
          toast.error(err.response.data.message || 'Validation error. Please check your inputs.');
        } else {
          toast.error('An unexpected error occurred while logging in. ' + err?.response?.data?.message || "Please try again later.");
          console.error('Error during logging in:', err);
        }
      } finally {
        setTimeout(() => {
          setSubmitting(false)
        }, 2000)
      }
    },
  });

  return (
    <div className='w-full h-screen flex flex-col lg:flex-row relative'>


      {/* Login Form Section */}
      <div className="absolute inset-0 lg:static w-full md:w-full h-screen flex justify-center items-center md:items-start flex-col p-8 bg-black/70 md:bg-white text-white md:text-black order-1 lg:order-2 z-20 lg:z-10 lg:shadow-lg">
        <form onSubmit={formik.handleSubmit} className="w-full space-y-6 text-center md:text-start">
          <h1 className='text-4xl md:text-5xl font-bold mb-2'>Welcome back</h1>
          <p className='text-sm md:text-2xl mb-8'>We are glad to have you back here</p>

          {/* username */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-white md:text-black" size={20} />
            </div>
            <input
              type="text"
              name="username"
              placeholder="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              className="w-full pl-10 py-3 rounded-lg bg-pryClr md:bg-[#1F3E17]/50 text-white placeholder-white md:placeholder:text-black focus:outline-none"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-white md:text-black" size={20} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full pl-10 pr-10 p-3 rounded-lg bg-pryClr md:bg-[#1F3E17]/50 text-white placeholder-white md:placeholder:text-black focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <PiSmileyXEyesFill className="text-white hover:text-gray-200" size={20} />
              ) : (
                <FaFaceRollingEyes className="text-white hover:text-gray-200" size={20} />
              )}
            </button>
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-pryClr focus:ring-pryClr border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-200 md:text-gray-600">
              Remember password
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-pryClr text-white py-3 rounded-lg hover:bg-pryClrDark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{formik.isSubmitting ? "Logging in..." : "Login"}</span>
            <FiArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

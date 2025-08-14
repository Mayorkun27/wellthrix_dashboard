import React from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import AnnouncementBoard from '../../components/AnnouncementBoard';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const API_URL = import.meta.env.VITE_API_BASE_URL

const ManageAnnouncement = () => {

    const { logout, token } = useUser()

    const formik = useFormik({
        initialValues: {
            title: "",
            message: "",
            start_date: "",
            end_date: "",
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .required("Announcement title is required!."),
            message: Yup.string()
                .required("Announcement message is required!."),
            start_date: Yup.string()
                .required("Announcement start date is required!."),
            end_date: Yup.string()
                .required("Announcement end date is required!."),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            console.log("values to be submitted", values)
            setSubmitting(true)
            try {
                const response = await axios.post(`${API_URL}/api/announcements`, values, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                })

                console.log("announcement post response", response)

                if (response.status === 201 && response.data.status === 201) {
                    toast.success(response.data.message || "Announcement posted successfully!")
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            } catch (error) {
                if (error?.response?.data?.message.toLowerCase() == "unauthenticated") {
                    logout()
                }
                console.error("An error occured posting announcements", error)
                toast.error(error?.response?.data?.message || "An error occured posting announcements")
            } finally {
                setTimeout(() => {
                    setSubmitting(false)
                }, 2000);
            }
        }
    })

    return (
        <div className='flex md:flex-row flex-col items-start gap-6 pb-1'>
            <div className="md:w-3/5 w-full bg-white md:p-6 p-4 rounded-lg shadow-sm">
                <h3 className='md:text-3xl text-2xl tracking-[-0.1em] mb-4 font-semibold'>Create Announcement</h3>
                <form onSubmit={formik.handleSubmit} className='grid grid-cols-2 gap-4'>
                    <div className="space-y-1 col-span-2">
                        <label className='font-medium' htmlFor="title">Title</label>
                        <input 
                            type="text" 
                            name='title'
                            id='title'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='bg-pryClr/20 w-full h-[50px] rounded-lg outline-0 indent-3'
                        />
                        {formik.touched.title && formik.errors.title && (<p className='text-red-700 text-sm'>{formik.errors.title}</p>)}
                    </div>
                    <div className="space-y-1 col-span-2">
                        <label className='font-medium' htmlFor="message">Message</label>
                        <textarea 
                            type="text" 
                            name='message'
                            id='message'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            rows={5}
                            className='bg-pryClr/20 w-full rounded-lg outline-0 p-3 resize-none no-scrollbar'
                        ></textarea>
                        {formik.touched.message && formik.errors.message && (<p className='text-red-700 text-sm'>{formik.errors.message}</p>)}
                    </div>
                    <div className="space-y-1 md:col-span-1 col-span-2">
                        <label className='font-medium' htmlFor="start_date">Start date</label>
                        <input 
                            type="date" 
                            name='start_date'
                            id='start_date'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='bg-pryClr/20 w-full h-[50px] rounded-lg outline-0 indent-3'
                        />
                        {formik.touched.start_date && formik.errors.start_date && (<p className='text-red-700 text-sm'>{formik.errors.start_date}</p>)}
                    </div>
                    <div className="space-y-1 md:col-span-1 col-span-2">
                        <label className='font-medium' htmlFor="end_date">End date</label>
                        <input 
                            type="date" 
                            name='end_date'
                            id='end_date'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className='bg-pryClr/20 w-full h-[50px] rounded-lg outline-0 indent-3'
                        />
                        {formik.touched.end_date && formik.errors.end_date && (<p className='text-red-700 text-sm'>{formik.errors.end_date}</p>)}
                    </div>
                    <div className="col-span-2 mt-6 text-center">
                        <button
                            type="submit"
                            disabled={!formik.isValid || formik.isSubmitting}
                            className='bg-pryClr text-secClr md:w-1/2 w-full rounded-lg h-[50px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
                        >
                            {
                                formik.isSubmitting ? "Posting..." : "Post"
                            }
                        </button>
                    </div>
                </form>
            </div>
            <div className="md:w-2/5 w-full bg-white md:p-6 p-4 rounded-lg shadow-sm">
                <h3 className='md:text-2xl text-lg mb-2 font-semibold tracking-[-0.1em]'>Announcement Board</h3>
                <div className="overflow-y-scroll md:max-h-[77vh] max-h-[65vh] pe-2 styled-scrollbar">
                    <AnnouncementBoard />
                </div>
            </div>
        </div>
    )
}

export default ManageAnnouncement
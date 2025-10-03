import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import AnnouncementBoard from '../../components/AnnouncementBoard';
import { toast } from 'sonner';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import assets from '../../assets/assests';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ManageAnnouncement = () => {

    const { logout, token } = useUser();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            formik.setFieldValue("image", file); // Set the file object directly

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
            setImagePreview(null);
            formik.setFieldValue("image", null); // Clear the file object if no file selected
        }
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            message: "",
            start_date: "",
            end_date: "",
            image: null, // Initialize image as null
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
            image: Yup.mixed()
                .required('Announcement image is required') // Changed for clarity
                .test('fileType', 'Unsupported file format. Only JPG, JPEG, and PNG are allowed.', (value) => {
                    return value && (value.type === 'image/jpeg' || value.type === 'image/png' || value.type === 'image/jpg');
                })
                .test('fileSize', 'File size is too large. Max size is 1MB.', (value) => {
                    return value && value.size <= 1 * 1024 * 1024;
                })
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            console.log("values to be submitted", values);
            setSubmitting(true);
            const toastId = toast.loading("Posting announcement...");

            try {
                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("message", values.message);
                formData.append("start_date", values.start_date);
                formData.append("end_date", values.end_date);
                if (values.image) {
                    formData.append("image", values.image); // Append the actual file object
                }

                const response = await axios.post(`${API_URL}/api/announcements`, formData, { // Send FormData
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data" // Important for file uploads
                    }
                });

                console.log("announcement post response", response);

                if (response.status === 201 || response.data.status === 201) { // Check for 201 or data.status 201
                    toast.success(response.data.message || "Announcement posted successfully!", { id: toastId });
                    resetForm(); // Reset Formik form state
                    setSelectedImage(null); // Clear selected image state
                    setImagePreview(null); // Clear image preview state
                    // Reload is a strong operation, consider fetching data again
                    setTimeout(() => {
                        setRefresh(true)
                    }, 1000);
                } else {
                    throw new Error(response.data.message || "Failed to post announcement.");
                }
            } catch (error) {
                if (error?.response?.data?.message?.toLowerCase().includes("unauthenticated")) {
                    logout();
                    toast.error("Session expired. Please login again.", { id: toastId });
                } else {
                    console.error("An error occurred posting announcements", error);
                    toast.error(error?.response?.data?.message || "An error occurred posting announcements", { id: toastId });
                }
            } finally {
                setSubmitting(false); // Ensure submitting state is always reset
            }
        }
    });

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
                            value={formik.values.title} // Bind value to formik state
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
                            value={formik.values.message} // Bind value to formik state
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
                            value={formik.values.start_date} // Bind value to formik state
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
                            value={formik.values.end_date} // Bind value to formik state
                            className='bg-pryClr/20 w-full h-[50px] rounded-lg outline-0 indent-3'
                        />
                        {formik.touched.end_date && formik.errors.end_date && (<p className='text-red-700 text-sm'>{formik.errors.end_date}</p>)}
                    </div>
                    <div className="col-span-2 w-full flex flex-col gap-2">
                        <label htmlFor="image" className="font-medium">Attach image</label>
                        <div className="border border-dashed border-pryClr rounded p-2 w-full">
                            <label className="flex flex-col items-center justify-center cursor-pointer">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-20 w-20 mb-2 object-cover rounded"
                                    />
                                ) : (
                                    <img
                                        src={assets.fileup}
                                        alt="Upload"
                                        className="h-10 w-10 mb-4 opacity-80"
                                    />
                                )}
                                <div className="flex flex-col-reverse items-center">
                                    <span className="text-pryClr text-sm border border-pryClr/20 p-2 rounded-[10px] whitespace-nowrap">
                                        Choose File
                                    </span>
                                    <span className="text-pryClr text-sm">
                                        {selectedImage ? selectedImage.name : "No file chosen"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        {formik.touched.image && formik.errors.image && (
                            <div className="text-red-500 text-xs mt-1">
                                {formik.errors.image}
                            </div>
                        )}
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
                    <AnnouncementBoard refresh={refresh} />
                </div>
            </div>
        </div>
    );
};

export default ManageAnnouncement;
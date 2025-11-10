import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { formatterUtility } from "../../utilities/formatterutility";
import PaginationControls from "../../utilities/PaginationControls";
import { PiCurrencyNgn, PiCoins, PiHandWithdraw, PiHandCoins, PiShoppingCartSimple } from 'react-icons/pi';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const IMAGE_BASE_URL = "https://api.wellthrixinternational.com/storage/app/public";

const SalesReport = () => {
    const [summary, setSummary] = useState({});
    const [topProducts, setTopProducts] = useState([]);
    const [topEarners, setTopEarners] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { token, logout } = useUser();
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage] = useState(10);

    const formik = useFormik({
        initialValues: {
            start_date: "2025-09-01",
            end_date: "",
            member_name: "",
            product_name: "",
            region: "",
            status: "",
        },
        onSubmit: async (values) => {
            fetchReport(values);
        },
    });

    const fetchReport = async (filters) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/admin/reports/sales`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    start_date: filters.start_date,
                    end_date: filters.end_date,
                    member_name: filters.member_name,
                    product_name: filters.product_name,
                    region: filters.region,
                    status: filters.status,
                    page: currentPage,
                    per_page: perPage,
                },
            });

            console.log("Sales report retrieve response:", response);

            if (response.status === 200) {
                setSummary(response.data.summary || {});
                setTopProducts(response.data.top_products || []);
                setTopEarners(response.data.top_earners || []);
                setCurrentPage(response.data.current_page || 1);
                setLastPage(response.data.last_page || 1);
            }
        } catch (error) {
            console.error("Sales report retrieve error:", error.response || error);
            if (error.response?.data?.message?.includes("unauthenticated")) {
                logout();
                toast.error("Session expired. Please login again.");
            } else {
                toast.error(error.response?.data?.message || "An error occurred retrieving sales report.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Summary\n";
        csvContent += "Metric,Value\n";
        csvContent += `Total Sales (NGN),${summary.total_sales}\n`;
        csvContent += `Total PV,${summary.total_pv}\n`;
        csvContent += `Total Payout (NGN),${summary.total_payout}\n`;
        csvContent += `Company Profit (NGN),${summary.company_profit}\n`;
        csvContent += `Orders Count,${summary.orders_count}\n`;
        csvContent += "\nTop Products\n";
        csvContent += "Product Name,Qty,PV,Amount (NGN)\n";
        topProducts.forEach((prod) => {
            csvContent += `${prod.product_name},${prod.qty},${prod.pv},${prod.amount}\n`;
        });
        csvContent += "\nTop Earners\n";
        csvContent += "Username,Amount (NGN),PV\n";
        topEarners.forEach((earner) => {
            csvContent += `${earner.username},${earner.amount},${earner.pv}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sales_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchReport(formik.values);
    }, [token, currentPage]);

    return (
        <div className="space-y-4">


            <div className="space-y-4">

                <div className="flex flex-col gap-6 md:gap-4 mb-6">
                    {/* Top Row: 2 Cards */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:flex-1">
                            <div className='bg-pryClr p-4 text-secClr rounded-lg flex items-center gap-2 shadow-md'>
                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                    <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                                        <PiCurrencyNgn />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 w-[calc(100%-40px)]">
                                    <div className="flex items-center justify-between w-full">
                                        <small className="lg:text-[10px] text-xs">Total Sales (₦)</small>
                                    </div>
                                    <h4 className='text-xl font-bold text-white'>
                                        {formatterUtility(Number(summary.total_sales || 0))}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:flex-1">
                            <div className='bg-pryClr p-4 text-secClr rounded-lg flex items-center gap-2 shadow-md'>
                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                    <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                                        <PiCoins />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 w-[calc(100%-40px)]">
                                    <div className="flex items-center justify-between w-full">
                                        <small className="lg:text-[10px] text-xs">Total PV</small>
                                    </div>
                                    <h4 className='text-xl font-bold text-white'>
                                        {summary.total_pv || 0}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Bottom Row: 3 Cards */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:flex-1">
                            <div className='bg-pryClr p-4 text-secClr rounded-lg flex items-center gap-2 shadow-md'>
                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                    <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                                        <PiHandWithdraw />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 w-[calc(100%-40px)]">
                                    <div className="flex items-center justify-between w-full">
                                        <small className="lg:text-[10px] text-xs">Total Payout (₦)</small>
                                    </div>
                                    <h4 className='text-xl font-bold text-white'>
                                        {formatterUtility(Number(summary.total_payout || 0))}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:flex-1">
                            <div className='bg-pryClr p-4 text-secClr rounded-lg flex items-center gap-2 shadow-md'>
                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                    <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                                        <PiHandCoins />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 w-[calc(100%-40px)]">
                                    <div className="flex items-center justify-between w-full">
                                        <small className="lg:text-[10px] text-xs">Company Profit (₦)</small>
                                    </div>
                                    <h4
                                        className={`text-xl font-bold ${summary.company_profit < 0 ? "text-red-600" : "text-green-600"}`}
                                    >
                                        {formatterUtility(Number(summary.company_profit || 0))}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:flex-1">
                            <div className='bg-pryClr p-4 text-secClr rounded-lg flex items-center gap-2 shadow-md'>
                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                                    <div className='bg-secClr text-pryClr w-full h-full flex items-center justify-center text-xl'>
                                        <PiShoppingCartSimple />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 w-[calc(100%-40px)]">
                                    <div className="flex items-center justify-between w-full">
                                        <small className="lg:text-[10px] text-xs">Orders Count</small>
                                    </div>
                                    <h4 className='text-xl font-bold text-white'>
                                        {summary.orders_count || 0}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={formik.handleSubmit}
                    className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Filter by Date
                    </h3>

                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                        {/* Start Date */}
                        <div className="flex flex-col w-full sm:flex-1">
                            <label
                                htmlFor="start_date"
                                className="text-sm font-medium text-gray-600 mb-2"
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                id="start_date"
                                value={formik.values.start_date}
                                onChange={formik.handleChange}
                                className="border border-gray-300 focus:border-pryClr focus:ring-2 focus:ring-pryClr/30 transition-all h-[46px] rounded-lg outline-none px-3 text-gray-700"
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col w-full sm:flex-1">
                            <label
                                htmlFor="end_date"
                                className="text-sm font-medium text-gray-600 mb-2"
                            >
                                End Date
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                id="end_date"
                                value={formik.values.end_date}
                                onChange={formik.handleChange}
                                className="border border-gray-300 focus:border-pryClr focus:ring-2 focus:ring-pryClr/30 transition-all h-[46px] rounded-lg outline-none px-3 text-gray-700"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="w-full sm:w-auto sm:ml-2">
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className={`bg-pryClr text-white font-medium px-6 py-[11px] rounded-lg shadow hover:shadow-lg hover:bg-pryClr/90 transition-all duration-200 w-full sm:w-auto ${formik.isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                {formik.isSubmitting ? "Applying..." : "Apply Filters"}
                            </button>
                        </div>
                    </div>
                </form>



                <div className="flex justify-between items-center mb-4 mt-6">
                    <h3 className="md:text-3xl text-2xl tracking-[-0.1em] font-semibold text-black/80">
                        Top-Selling Products
                    </h3>
                    <button
                        onClick={exportToCSV}
                        className="bg-pryClr text-white px-4 py-2 rounded-lg hover:bg-pryClr/80"
                    >
                        Export CSV
                    </button>
                </div>
                <div className="shadow-sm rounded bg-white overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 whitespace-nowrap">
                                <th className="lg:p-5 p-3 text-center">ID</th>
                                <th className="lg:p-5 p-3 text-center">Product Name</th>
                                <th className="lg:p-5 p-3 text-center">Qty</th>
                                <th className="lg:p-5 p-3 text-center">PV</th>
                                <th className="lg:p-5 p-3 text-center">Amount (₦)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="lg:p-5 p-3 text-center" colSpan={6}>Loading...</td>
                                </tr>
                            ) : topProducts.length > 0 ? (
                                topProducts.map((prod, i) => {
                                    const serialNumber = (currentPage - 1) * perPage + (i + 1);
                                    return (
                                        <tr
                                            key={i}
                                            className="hover:bg-gray-50 text-sm border-b border-black/10"
                                        >
                                            <td className="lg:p-5 p-3 text-center">{String(serialNumber).padStart(3, "0")}</td>
                                            <td className="lg:p-5 p-3 text-center">{prod.product_name}</td>
                                            <td className="lg:p-5 p-3 text-center">{prod.qty}</td>
                                            <td className="lg:p-5 p-3 text-center">{prod.pv}</td>
                                            <td className="lg:p-5 p-3 text-center">{formatterUtility(Number(prod.amount))}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-8">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {!isLoading && topProducts.length > 0 && (
                        <div className="p-4">
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={lastPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
                <h3 className="md:text-3xl text-2xl tracking-[-0.1em] mt-8 mb-4 font-semibold text-black/80">
                    Top Earners
                </h3>
                <div className="shadow-sm rounded bg-white overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-black/70 text-[12px] uppercase border-b border-black/20 whitespace-nowrap">
                                <th className="lg:p-5 p-3 text-center">ID</th>
                                <th className="lg:p-5 p-3 text-center">Username</th>
                                <th className="lg:p-5 p-3 text-center">Name</th>
                                <th className="lg:p-5 p-3 text-center">PV</th>
                                <th className="lg:p-5 p-3 text-center">Amount (₦)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td className="lg:p-5 p-3 text-center" colSpan={5}>Loading...</td>
                                </tr>
                            ) : topEarners.length > 0 ? (
                                topEarners.map((earner, i) => {
                                    const serialNumber = (currentPage - 1) * perPage + (i + 1);
                                    return (
                                        <tr
                                            key={i}
                                            className="hover:bg-gray-50 text-sm border-b border-black/10"
                                        >
                                            <td className="lg:p-5 p-3 text-center">{String(serialNumber).padStart(3, "0")}</td>
                                            <td className="lg:p-5 p-3 text-center">{earner.username}</td>
                                            <td className="lg:p-5 p-3 text-center">{earner.user.first_name} {earner.user.last_name}</td>
                                            <td className="lg:p-5 p-3 text-center">{earner.pv}</td>
                                            <td className="lg:p-5 p-3 text-center">{formatterUtility(Number(earner.amount))}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-8">
                                        No earners found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {!isLoading && topEarners.length > 0 && (
                        <div className="p-4">
                            <PaginationControls
                                currentPage={currentPage}
                                totalPages={lastPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesReport;
import React, { useState } from 'react'
import ProductCards from '../../components/cards/ProductCards'
import assets from '../../assets/assests'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../../context/UserContext'
import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_BASE_URL

const Products = () => {
  const { token, logout } = useUser()
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        setProducts(response.data.products)
        toast.error(response.data.message || "Products fetched successfully!")
      }

    } catch (error) {
      if (error.response.data.message.toLowerCase() == "unauthenticated") {
        logout()
      }
        console.error("An error occured posting announcements", error)
        toast.error("An error occured posting announcements")
      } finally {
        setTimeout(() => {
            setSubmitting(false)
        }, 2000);
      }
  }

  const physicalProducts = [
    {
        image: assets.product1,
        name: "Vitorep Herbal Drink 750ml",
        price: "20000",
        pv: "16",
        purchaseCondition: false,
        path: "/products/vitorepherbal",
    },
    {
        image: assets.product2,
        name: "Vitorep Fruit Powder",
        price: "18000",
        pv: "16",
        purchaseCondition: false,
        path: "/products/vitorepfruit",
    },
    {
        image: assets.product3,
        name: "Amandla",
        price: "14000",
        pv: "12",
        purchaseCondition: false,
        path: "/products/amandla",
    },
    {
        image: assets.product4,
        name: "Femed Herbal Capsule",
        price: "14000",
        pv: "12",
        purchaseCondition: false,
        path: "/products/femed",
    },
    {
        image: assets.product5,
        name: "Paigo Oil",
        price: "10500",
        pv: "8",
        purchaseCondition: true,
        path: "/products/paigo",
    },
    {
        image: assets.product6,
        name: "Chandar Coffe",
        price: "15000",
        pv: "13",
        purchaseCondition: true,
        path: "/products/chandarcoffee",
    },
    {
        image: assets.product7,
        name: "Fertiboom Herbal Capsule",
        price: "14000",
        pv: "12",
        purchaseCondition: false,
        path: "/products/fertiboom",
    },
    {
        image: assets.product8,
        name: "Gold Syrup",
        price: "10500",
        pv: "8",
        purchaseCondition: false,
        path: "/products/golddate",
    },
    {
        image: assets.product9,
        name: "Uptiflush",
        price: "14000",
        pv: "12",
        purchaseCondition: false,
        path: "/products/uptiflush",
    },
    {
        image: assets.product1,
        name: "Vitorep Herbal Drink 330ml",
        price: "10500",
        pv: "8",
        purchaseCondition: false,
        path: "/products/vitorepherbal",
    },
    {
        image: assets.product10,
        name: "Dahome Capsules",
        price: "14000",
        pv: "12",
        purchaseCondition: false,
        path: "/products/dahome",
    },
  ]

  return (
    <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-6 pb-2'>
      <div className="lg:col-span-3 md:col-span-2">
        <Link
          to={"/user/products/cart"}
          className='bg-pryClr w-max ms-auto px-4 h-[45px] flex items-center justify-center rounded-lg font-medium text-secClr'
        >
          View cart
        </Link>
      </div>
      {
        physicalProducts.map((product, index) => (
          <ProductCards key={index} product={product} />
        ))
      }
    </div>
  )
}

export default Products
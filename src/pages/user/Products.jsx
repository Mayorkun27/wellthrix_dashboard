import React from 'react'
import ProductCards from '../../components/cards/ProductCards'
import assets from '../../assets/assests'

const Products = () => {

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
      {
        physicalProducts.map((product, index) => (
          <ProductCards key={index} {...product} />
        ))
      }
    </div>
  )
}

export default Products
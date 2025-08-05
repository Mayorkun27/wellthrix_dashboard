import { TbCurrencyNaira } from "react-icons/tb"

export const formatterUtility = (amount, noSign=false) => {
    return <span className="inline-flex items-center">
            <TbCurrencyNaira size={20} className={`${noSign && "hidden"}`} />
            <span>{amount.toLocaleString()}</span>
        </span>
}
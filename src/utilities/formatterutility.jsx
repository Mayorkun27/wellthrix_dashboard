import { TbCurrencyNaira } from "react-icons/tb"

export const formatterUtility = (amount) => {
    return <div className="flex items-center gap-1">
            <TbCurrencyNaira size={20} />
            <span>{amount.toLocaleString()}</span>
        </div>
}
import type { CartData } from "@/app/schemas/cartData"

type CartButtonProps = {
    cartData: CartData
    selectionToggle: (action: "selectAll" | "clearAllSelection") => void,
    action: "selectAll" | "clearAllSelection"
}

export default function CartButton({ cartData, selectionToggle, action }: CartButtonProps) {
    return (
        <button
            disabled={cartData.length === 0}
            onClick={() => selectionToggle(action)}
            className="disabled:cursor-not-allowed px-2 bg-blue-600 text-white font-semibold rounded-md text-lg py-2 cursor-pointer transition-all duration-300 hover:bg-blue-400 hover:text-black">
            {action === "selectAll" ? "Select all" : "Clear all selection"}
        </button>
    )
}
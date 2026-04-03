type CartCheckboxProps = {
    is_selected: boolean,
    tickOrUntickCartItem: (product_id: number) => void,
    product_id: number
}

export default function CartCheckbox({ is_selected, tickOrUntickCartItem, product_id }: CartCheckboxProps) {
    return (
        <div>
            <input
                type="checkbox"
                checked={is_selected}
                onChange={() => tickOrUntickCartItem(product_id)}
                className="w-5 h-5 cursor-pointer text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
        </div>
    )
}
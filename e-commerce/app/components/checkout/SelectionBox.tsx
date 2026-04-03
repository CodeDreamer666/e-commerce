type SelectionBoxProps = {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    selectionText: { text: string, value: string }[]
    displayText: string,
    displayTextId: string
}

export default function SelectionBox({
    value,
    onChange,
    selectionText,
    displayText,
    displayTextId
}: SelectionBoxProps) {
    return (
        <section className="flex flex-col mb-4">
            <div className="flex gap-1 mb-2">
                <label htmlFor={displayTextId} className="font-semibold text">{displayText}</label>
                <span className="text-red-500">*</span>
            </div>
            <select
                value={value}
                onChange={onChange}
                id={displayTextId}
                name={displayTextId}
                className="transition-all duration-300 ease-in-out outline-none cursor-text focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:shadow-md border-gray-300 border w-full rounded-md h-10 px-4 text-sm"
            >
                {selectionText.map(({ text, value }) => {
                    return (
                        <option value={value} key={text}>
                            {text}
                        </option>
                    )
                })}
            </select>
        </section>
    )
}
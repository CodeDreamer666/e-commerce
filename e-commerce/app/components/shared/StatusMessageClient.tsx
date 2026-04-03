type StatusMessageProps = {
    isSuccess: "IDLE" | true | false,
    message: string,
    closeMessage: () => void
}

export default function StatusMessage({ isSuccess, message, closeMessage }: StatusMessageProps) {
    if (isSuccess === "IDLE") return null;

    return (
        <section className=
            {`fixed z-40 top-16 right-4 font-bold text-lg 
            ${isSuccess ? "bg-green-100 border-2 border-green-400 text-green-800" : "bg-red-100 border-2 border-red-400 text-red-800"} 
             px-3 py-2 rounded-md shadow-md mt-4`}>
          <div className="flex gap-1">
              <h2>
                {message}
            </h2>
            <button
                onClick={() => closeMessage()}
                className="size-6 cursor-pointer">
                X
            </button>
          </div>
        </section>
    )
}
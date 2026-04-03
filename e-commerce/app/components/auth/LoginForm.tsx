import type { SetStateAction } from "react"
import Input from "@/app/components/shared/Input"
import FormTitle from "@/app/components/checkout/FormTitle"
import Button from "@/app/components/shared/Button"

type Field = {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    displayText: string,
    text: string,
    placeholder: string,
    type: string
}

type LoginFormProps = {
    handleFormSubmission: (event: React.SyntheticEvent) => Promise<void>,
    active: "sign-in" | "login",
    inputList: Field[],
    setActive: React.Dispatch<SetStateAction<"login" | "sign-in">>
}

export default function LoginForm({
    handleFormSubmission,
    active,
    inputList,
    setActive
}: LoginFormProps) {
    return (

        <form
            onSubmit={handleFormSubmission}
            className={`flex flex-col px-6 py-4 rounded-lg bg-white/90 shadow-2xl transition-all duration-500 ease-in-out ${active === "login" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        >

            <FormTitle
                heading="Welcome back !"
                subHeading="Enter to shop"
            />

            {inputList.map(({ onChange, value, text, displayText, placeholder, type }) => {
                return (
                    <Input
                        key={text}
                        displayText={displayText}
                        text={text}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                    />

                )
            })}

            <Button
                displayText="Submit"
                type="submit"
            />

            <p className="font-semibold mt-6 text-right flex flex-col justify-end">
                <span>Don't have an account ?</span>
                <span onClick={() => setActive("sign-in")} className="text-blue-900 underline cursor-pointer hover:text-blue-500 transition-all duration-200">Register here</span>
            </p>
        </form>
    )
}

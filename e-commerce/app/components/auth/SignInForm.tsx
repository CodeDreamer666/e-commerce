import type { SetStateAction } from "react"
import Button from "@/app/components/shared/Button"
import FormTitle from "@/app/components/checkout/FormTitle"
import Input from "@/app/components/shared/Input"

type Field = {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    displayText: string,
    text: string,
    placeholder: string,
    type: string
}

type SignInFormProps = {
    handleFormSubmission: (event: React.SyntheticEvent) => Promise<void>,
    active: "sign-in" | "login",
    inputList: Field[],
    setActive: React.Dispatch<SetStateAction<"login" | "sign-in">>,
}

export default function SignInForm({
    handleFormSubmission,
    active,
    setActive,
    inputList
}: SignInFormProps) {
    return (
        <form
            onSubmit={handleFormSubmission}
            className={`flex flex-col px-6 py-4 rounded-lg bg-white/90 shadow-2xl transition-all duration-500 ease-in-out ${active === "sign-in" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        >

            <FormTitle
                heading="Let’s get you started !"
                subHeading="Sign up to track orders, save favorites, and more"
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
                <span>Already have an account ?</span>
                <span onClick={() => setActive("login")} className="text-blue-900 underline cursor-pointer hover:text-blue-500 transition-all duration-200">Login here</span>
            </p>
        </form>
    )
}
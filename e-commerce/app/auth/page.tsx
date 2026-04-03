"use client"
import { useState } from "react"
import useStatusMessage from "@/app/hooks/useStatusMessage"
import StatusMessage from "@/app/components/shared/StatusMessageClient"
import sendRequestAndGetResponse from "@/app/lib/sendRequest"
import SignInForm from "../components/auth/SignInForm"
import { loginSchema } from "@/app/schemas/userAuth"
import { signInSchema } from "@/app/schemas/userAuth"
import LoginForm from "../components/auth/LoginForm"

type Payload =
    { email: string, password: string } |
    { email: string, password: string, username: string }

export default function SignIn() {
    const [active, setActive] = useState<"login" | "sign-in">("login");
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [emailInput, setEmailInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");

    const {
        isSuccess,
        setIsSuccess,
        message,
        setMessage
    } = useStatusMessage();

    async function handleFormSubmission(action: "login" | "sign-in", event: React.SyntheticEvent) {
        event.preventDefault();

        let zodValidation;

        let payload: Payload = {
            email: emailInput,
            password: passwordInput
        }

        zodValidation = loginSchema.safeParse(payload);

        if (action === "sign-in") {
            payload = { ...payload, username: usernameInput }
            zodValidation = signInSchema.safeParse(payload);
        }

        if (!zodValidation.success) {
            setIsSuccess(zodValidation.success);
            const firstError = zodValidation.error.issues[0].message;
            setMessage(firstError);
            return;
        }

        const result = await sendRequestAndGetResponse({
            method: "POST",
            url: `http://localhost:8000/auth/${action}`,
            body: payload,
        });

        setIsSuccess(result.isSuccess);

        if (result.isSuccess) {
            setMessage(result.message);
            setTimeout(() => {
                window.location.replace("/");
            }, 1500)
        } else {
            setMessage(result.error);
        }
    }

    return (
        <section className="bg-[linear-gradient(to_bottom_right,#ffffff,#f5f5f5)] overflow-hidden py-4 mt-16 min-h-[90vh] flex flex-col items-center justify-center">

            <StatusMessage
                isSuccess={isSuccess}
                message={message}
                closeMessage={() => {
                    setIsSuccess("IDLE")
                    setMessage("")
                }}
            />

            <div className="w-[95%] max-w-100 py-6">
                <div className="relative w-full">

                    {active === "login" && (
                        <LoginForm
                            handleFormSubmission={(event) => handleFormSubmission("login", event)}
                            active={active}
                            inputList={[
                                {
                                    value: emailInput,
                                    onChange: (event) => setEmailInput(event.target.value),
                                    displayText: "Email",
                                    text: "email",
                                    type: "email",
                                    placeholder: "Enter your email"
                                },
                                {
                                    value: passwordInput,
                                    onChange: (event) => setPasswordInput(event.target.value),
                                    displayText: "Password",
                                    text: "password",
                                    type: "password",
                                    placeholder: "Enter your password"
                                }
                            ]}
                            setActive={setActive}
                        />
                    )}

                    {active === "sign-in" && (
                        <SignInForm
                            handleFormSubmission={(event) => handleFormSubmission("sign-in", event)}
                            active={active}
                            setActive={setActive}
                            inputList={[
                                {
                                    value: usernameInput,
                                    onChange: (event) => setUsernameInput(event.target.value),
                                    displayText: "Username",
                                    text: "username",
                                    type: "text",
                                    placeholder: "Enter your username"
                                },
                                {
                                    value: emailInput,
                                    onChange: (event) => setEmailInput(event.target.value),
                                    displayText: "Email",
                                    text: "email",
                                    type: "email",
                                    placeholder: "Enter your email"
                                },
                                {
                                    value: passwordInput,
                                    onChange: (event) => setPasswordInput(event.target.value),
                                    displayText: "Password",
                                    text: "password",
                                    type: "password",
                                    placeholder: "Enter your password"
                                }
                            ]}
                        />
                    )}
                    
                </div>
            </div>

        </section>
    )
}
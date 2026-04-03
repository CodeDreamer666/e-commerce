type NavigationProps = {
    displayText: string,
    currentStep: string,
    expectedStep: string
}

export default function CurrentStep({ displayText, currentStep, expectedStep }: NavigationProps) {
    return (
        <li className={`px-4 whitespace-nowrap ${currentStep === expectedStep ? "text-blue-800" : ""}`}>
                {displayText}
        </li>
    )
}
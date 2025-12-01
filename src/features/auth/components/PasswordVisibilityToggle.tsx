import TablerEye from "~icons/tabler/eye"
import TablerEyeClosed from "~icons/tabler/eye-closed"

interface PasswordVisibilityToggleProps {
	isVisible: boolean
	onToggle: () => void
	label?: string
}

const PasswordVisibilityToggle = ({ isVisible, onToggle, label = "password" }: PasswordVisibilityToggleProps) => {
	const ariaLabel = `${isVisible ? "Hide" : "Show"} ${label}`

	return (
		<button
			aria-label={ariaLabel}
			className="text-default-400"
			onClick={onToggle}
			onMouseDown={(event) => event.preventDefault()}
			type="button"
		>
			{isVisible ? <TablerEye className="size-5" /> : <TablerEyeClosed className="size-5" />}
		</button>
	)
}

export default PasswordVisibilityToggle

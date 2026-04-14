import { Link } from "@tanstack/react-router"

import type React from "react"

const DashboardLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
	<Link
		className="link font-medium text-[#18181b] text-[14px] leading-[18px] underline decoration-[#cdcdce] decoration-solid underline-offset-auto [text-decoration-skip-ink:none] [text-decoration-thickness:10%] [text-underline-position:from-font]"
		to={to}
	>
		{children}
	</Link>
)

export default DashboardLink

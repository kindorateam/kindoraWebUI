import { Outlet } from "@tanstack/react-router"
import { useState } from "react"

import Header from "./Header"
import NavDrawer from "./NavDrawer"

const MainLayout = () => {
	const [isNavigationOpen, setIsNavigationOpen] = useState(false)

	return (
		<div className="grid h-dvh overflow-hidden lg:grid-cols-[200px_minmax(0,1fr)]">
			<NavDrawer isOpen={isNavigationOpen} onClose={() => setIsNavigationOpen(false)} />

			<div className="relative flex h-dvh min-h-0 min-w-0 flex-col">
				<div className="min-h-0 overflow-y-auto">
					<Header onOpenNavigation={() => setIsNavigationOpen(true)} />
					<div className="pb-15">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}

export default MainLayout

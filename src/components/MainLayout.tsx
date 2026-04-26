import { Outlet } from "@tanstack/react-router"

import Header from "./Header"
import NavDrawer from "./NavDrawer"

const MainLayout = () => {
	return (
		<div className="grid h-screen grid-cols-[200px_1fr]">
			<NavDrawer />

			<div className="relative flex h-screen min-h-0 min-w-0 flex-col">
				<div className="min-h-0 overflow-y-auto">
					<Header />
					<div className="pb-15">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	)
}

export default MainLayout

import { Avatar, Badge, Button, Description, Dropdown, Header as HeroHeader, Label, Separator } from "@heroui/react"
import { useLocation } from "@tanstack/react-router"

import Breadcrumbs from "@/components/Breadcrumbs"
import useAuth from "@/features/auth/hooks/useAuth"
import useDashboardHeaderTransition from "@/hooks/useDashboardHeaderTransition"
import MdiBellOutline from "~icons/mdi/bell-outline"

const DASHBOARD_BG_FROM = { r: 4, g: 133, b: 247 } // #0485f7
const DASHBOARD_BG_TO = { r: 255, g: 255, b: 255 }
const INVERSE_THRESHOLD = 0.5

const interpolateChannel = (from: number, to: number, progress: number) => Math.round(from + (to - from) * progress)

const Header = () => {
	const { user, logoutAndRedirect } = useAuth()
	const { pathname } = useLocation()
	const isDashboard = pathname === "/dashboard"
	const { ref, progress } = useDashboardHeaderTransition(isDashboard)

	const handleLogout = async () => {
		await logoutAndRedirect()
	}

	const isInverse = isDashboard && progress < INVERSE_THRESHOLD
	const dashboardBackgroundColor = `rgb(${interpolateChannel(DASHBOARD_BG_FROM.r, DASHBOARD_BG_TO.r, progress)} ${interpolateChannel(DASHBOARD_BG_FROM.g, DASHBOARD_BG_TO.g, progress)} ${interpolateChannel(DASHBOARD_BG_FROM.b, DASHBOARD_BG_TO.b, progress)})`

	return (
		<nav
			className={`w-full ${isDashboard ? "sticky top-0 z-10 py-2" : "mb-6 bg-transparent py-2"}`}
			ref={ref}
			style={isDashboard ? { backgroundColor: dashboardBackgroundColor } : undefined}
		>
			<div className={`flex items-center ${isDashboard ? "mx-auto w-full max-w-[1230px] px-4 sm:px-6" : "px-4"}`}>
				<div className="flex-1">
					<Breadcrumbs inverse={isInverse} />
				</div>

				<div className="flex items-center gap-5">
					<Badge.Anchor>
						<Button aria-label="more than 99 notifications" className="bg-white shadow-md" isIconOnly variant="ghost">
							<MdiBellOutline />
						</Button>
						<Badge color="danger">3</Badge>
					</Badge.Anchor>
					<Dropdown>
						<Dropdown.Trigger>
							<Avatar className="cursor-pointer transition-transform lg:h-10 lg:w-10" size="sm">
								<Avatar.Image alt="Jason Hughes" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
								<Avatar.Fallback>JH</Avatar.Fallback>
							</Avatar>
						</Dropdown.Trigger>
						<Dropdown.Popover>
							<Dropdown.Menu aria-label="Profile Actions">
								<Dropdown.Section>
									<HeroHeader>
										<Label>{user?.name}</Label>
										<Description>{user?.email}</Description>
									</HeroHeader>
								</Dropdown.Section>

								<Separator />

								<Dropdown.Section>
									<Dropdown.Item id="settings" textValue="My profile">
										<Label>My profile</Label>
									</Dropdown.Item>
									<Dropdown.Item id="team_settings" textValue="School settings">
										<Label>School settings</Label>
									</Dropdown.Item>
									<Dropdown.Item id="analytics" textValue="Subscription">
										<Label>Subscription</Label>
									</Dropdown.Item>
								</Dropdown.Section>

								<Separator />

								<Dropdown.Section>
									<Dropdown.Item id="logout" onPress={handleLogout} textValue="Log Out" variant="danger">
										<Label>Log Out</Label>
									</Dropdown.Item>
								</Dropdown.Section>
							</Dropdown.Menu>
						</Dropdown.Popover>
					</Dropdown>
				</div>
			</div>
		</nav>
	)
}

export default Header

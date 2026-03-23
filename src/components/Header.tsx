import {
	Avatar,
	Badge,
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	Navbar,
	NavbarContent,
	NavbarItem,
} from "@heroui/react"
import { memo, useCallback } from "react"

import Breadcrumbs from "@/components/Breadcrumbs"
import useAuth from "@/features/auth/hooks/useAuth"
import MaterialSymbolsLogoutRounded from "~icons/material-symbols/logout-rounded"
import MdiBellOutline from "~icons/mdi/bell-outline"
import MdiCardAccountDetailsOutline from "~icons/mdi/card-account-details-outline"
import MdiCreditCardOutline from "~icons/mdi/credit-card-outline"
import MdiDomain from "~icons/mdi/domain"

const navbarClassNames = {
	base: "h-20 w-full mb-7 px-7 bg-transparent",
	wrapper: "w-full max-w-none p-0",
}

const Header = memo(() => {
	const { user, logoutAndRedirect } = useAuth()

	const handleLogout = useCallback(async () => {
		await logoutAndRedirect()
	}, [logoutAndRedirect])

	return (
		<Navbar classNames={navbarClassNames}>
			<NavbarContent>
				<NavbarItem className="flex-1">
					<Breadcrumbs />
				</NavbarItem>
			</NavbarContent>

			<NavbarContent className="items-center gap-5" justify="end">
				<Badge color="danger" content="3" shape="circle">
					<Button
						aria-label="more than 99 notifications"
						className="bg-white shadow-md"
						isIconOnly
						radius="full"
						variant="light"
					>
						<MdiBellOutline />
					</Button>
				</Badge>
				<Dropdown className="p-0" placement="bottom-end">
					<DropdownTrigger>
						<Avatar
							as="button"
							className="transition-transform lg:h-10 lg:w-10"
							color="secondary"
							name="Jason Hughes"
							size="sm"
							src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
						/>
					</DropdownTrigger>
					<DropdownMenu aria-label="Profile Actions" className="p-7">
						<DropdownSection className="m-0" dividerProps={{ className: "my-1.5" }} showDivider>
							<DropdownItem className="p-0" key="profile">
								<p className="font-semibold lg:text-lg">{user?.name}</p>
								<p className="font-semibold text-brand lg:text-xs">{user?.email}</p>
							</DropdownItem>
						</DropdownSection>

						<DropdownSection className="m-0" dividerProps={{ className: "my-1.5" }} showDivider>
							<DropdownItem
								className="px-0 py-2"
								key="settings"
								startContent={<MdiCardAccountDetailsOutline className="h-4 w-4" />}
							>
								My profile
							</DropdownItem>
							<DropdownItem className="px-0 py-2" key="team_settings" startContent={<MdiDomain className="h-4 w-4" />}>
								School settings
							</DropdownItem>
							<DropdownItem
								className="px-0 py-2"
								key="analytics"
								startContent={<MdiCreditCardOutline className="h-4 w-4" />}
							>
								Subscription
							</DropdownItem>
						</DropdownSection>

						<DropdownSection>
							<DropdownItem
								className="px-0 py-2"
								color="danger"
								key="logout"
								onClick={handleLogout}
								startContent={<MaterialSymbolsLogoutRounded className="h-4 w-4" />}
							>
								Log Out
							</DropdownItem>
						</DropdownSection>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
		</Navbar>
	)
})

Header.displayName = "Header"

export default Header

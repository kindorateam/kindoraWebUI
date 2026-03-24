import { Avatar, Badge, Button, Dropdown, Label, Navbar, NavbarContent, NavbarItem, Separator } from "@heroui/react"
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
				<Badge.Anchor>
					<Button
						aria-label="more than 99 notifications"
						className="bg-white shadow-md"
						isIconOnly
						radius="full"
						variant="light"
					>
						<MdiBellOutline />
					</Button>
					<Badge color="danger">3</Badge>
				</Badge.Anchor>
				<Dropdown className="p-0" placement="bottom-end">
					<Dropdown.Trigger>
						<Avatar
							as="button"
							className="cursor-pointer transition-transform lg:h-10 lg:w-10"
							color="secondary"
							size="sm"
						>
							<Avatar.Image alt="Jason Hughes" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
							<Avatar.Fallback>JH</Avatar.Fallback>
						</Avatar>
					</Dropdown.Trigger>
					<Dropdown.Popover>
						<Dropdown.Menu aria-label="Profile Actions" className="p-7">
							<Dropdown.Section className="m-0">
								<Dropdown.Item id="profile" textValue={user?.name ?? "profile"}>
									<Label>
										<p className="font-semibold lg:text-lg">{user?.name}</p>
										<p className="font-semibold text-brand lg:text-xs">{user?.email}</p>
									</Label>
								</Dropdown.Item>
							</Dropdown.Section>

							<Separator className="my-1.5" />

							<Dropdown.Section className="m-0">
								<Dropdown.Item
									className="px-0 py-2"
									id="settings"
									textValue="My profile"
									startContent={<MdiCardAccountDetailsOutline className="h-4 w-4" />}
								>
									<Label>My profile</Label>
								</Dropdown.Item>
								<Dropdown.Item
									className="px-0 py-2"
									id="team_settings"
									textValue="School settings"
									startContent={<MdiDomain className="h-4 w-4" />}
								>
									<Label>School settings</Label>
								</Dropdown.Item>
								<Dropdown.Item
									className="px-0 py-2"
									id="analytics"
									textValue="Subscription"
									startContent={<MdiCreditCardOutline className="h-4 w-4" />}
								>
									<Label>Subscription</Label>
								</Dropdown.Item>
							</Dropdown.Section>

							<Separator className="my-1.5" />

							<Dropdown.Section>
								<Dropdown.Item
									className="px-0 py-2"
									color="danger"
									id="logout"
									onPress={handleLogout}
									textValue="Log Out"
									startContent={<MaterialSymbolsLogoutRounded className="h-4 w-4" />}
								>
									<Label>Log Out</Label>
								</Dropdown.Item>
							</Dropdown.Section>
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>
			</NavbarContent>
		</Navbar>
	)
})

Header.displayName = "Header"

export default Header

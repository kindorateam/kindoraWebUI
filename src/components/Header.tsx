import { Avatar, Badge, Button, Dropdown, Label, Separator } from "@heroui/react"
import { memo, useCallback } from "react"

import Breadcrumbs from "@/components/Breadcrumbs"
import useAuth from "@/features/auth/hooks/useAuth"
import MdiBellOutline from "~icons/mdi/bell-outline"

const Header = memo(() => {
	const { user, logoutAndRedirect } = useAuth()

	const handleLogout = useCallback(async () => {
		await logoutAndRedirect()
	}, [logoutAndRedirect])

	return (
		<nav className="mb-7 flex h-20 w-full items-center bg-transparent px-7">
			<div className="flex-1">
				<Breadcrumbs />
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
								<Dropdown.Item className="px-0 py-2" id="settings" textValue="My profile">
									<Label>My profile</Label>
								</Dropdown.Item>
								<Dropdown.Item className="px-0 py-2" id="team_settings" textValue="School settings">
									<Label>School settings</Label>
								</Dropdown.Item>
								<Dropdown.Item className="px-0 py-2" id="analytics" textValue="Subscription">
									<Label>Subscription</Label>
								</Dropdown.Item>
							</Dropdown.Section>

							<Separator className="my-1.5" />

							<Dropdown.Section>
								<Dropdown.Item className="px-0 py-2" id="logout" onPress={handleLogout} textValue="Log Out">
									<Label>Log Out</Label>
								</Dropdown.Item>
							</Dropdown.Section>
						</Dropdown.Menu>
					</Dropdown.Popover>
				</Dropdown>
			</div>
		</nav>
	)
})

Header.displayName = "Header"

export default Header

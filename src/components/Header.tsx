import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarContent,
  NavbarItem,
} from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { memo, useCallback } from 'react'

import Breadcrumbs from '@/components/Breadcrumbs'
import NotificationIcon from '@/components/icons/NotificationIcon'
import ProfileIcon from '@/components/icons/ProfileIcon'
import SchoolIcon from '@/components/icons/SchoolIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import SignOutIcon from '@/components/icons/SignOutIcon'
import SubscriptionIcon from '@/components/icons/SubscriptionIcon'
import useAuth from '@/hooks/useAuth'

const navbarClassNames = {
  base: 'h-20 w-full mb-7 px-7 bg-transparent',
  wrapper: 'w-full max-w-none p-0',
}

const inputClassNames = {
  base: 'w-[150px]',
  input: 'ps-2! font-normal rounded-4xl text-sm',
  inputWrapper: 'h-9.5 ps-4 rounded-[20px] shadow-md bg-white',
}

const Header = memo(() => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    logout()
    void navigate({ to: '/login', replace: true })
  }, [logout, navigate])

  return (
    <Navbar classNames={navbarClassNames}>
      <NavbarContent>
        <NavbarItem className="flex-1">
          <Breadcrumbs />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="items-center gap-5" justify="end">
        <Input
          classNames={inputClassNames}
          placeholder="Search"
          size="sm"
          startContent={<SearchIcon />}
          type="search"
        />
        <Badge color="danger" content="3" shape="circle">
          <Button
            aria-label="more than 99 notifications"
            className="bg-white shadow-md"
            isIconOnly
            radius="full"
            variant="light"
          >
            <NotificationIcon />
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
            <DropdownSection
              className="m-0"
              dividerProps={{ className: 'my-1.5' }}
              showDivider
            >
              <DropdownItem className="p-0" key="profile">
                <p className="font-semibold lg:text-lg">{user?.name}</p>
                <p className="text-wine-700 font-semibold lg:text-xs">
                  {user?.email}
                </p>
              </DropdownItem>
            </DropdownSection>

            <DropdownSection
              className="m-0"
              dividerProps={{ className: 'my-1.5' }}
              showDivider
            >
              <DropdownItem
                className="px-0 py-2"
                key="settings"
                startContent={<ProfileIcon className="h-4 w-4" />}
              >
                My profile
              </DropdownItem>
              <DropdownItem
                className="px-0 py-2"
                key="team_settings"
                startContent={<SchoolIcon className="h-4 w-4" />}
              >
                School settings
              </DropdownItem>
              <DropdownItem
                className="px-0 py-2"
                key="analytics"
                startContent={<SubscriptionIcon className="h-4 w-4" />}
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
                startContent={<SignOutIcon className="h-4 w-4" />}
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

Header.displayName = 'Header'

export default Header

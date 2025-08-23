import {
  Avatar,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import RoomIcon from '@/components/RoomIcon'
import usePinVisibility from '@/hooks/usePinVisibility'
import { getStaffMembers } from '@/services/staff.service'

import type Staff from '@/types/staff.types'

const columns = [
  { key: 'staff', label: 'Staff' },
  { key: 'role', label: 'Role' },
  { key: 'email', label: 'Email' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'pin', label: 'Pin' },
]

const StaffTable = () => {
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: getStaffMembers,
  })

  const { isPinVisible, togglePinVisibility } = usePinVisibility()

  const renderCell = useCallback(
    (staff: Staff, columnKey: string) => {
      const isVisible = isPinVisible(staff.id)

      switch (columnKey) {
        case 'staff':
          return (
            <div className="flex items-center gap-3">
              <Avatar
                alt={staff.name}
                className="h-10 w-10"
                showFallback
                src={staff.avatar}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{staff.name}</span>
                {staff.isCurrentUser && (
                  <span className="text-xs text-green-500">My account</span>
                )}
              </div>
            </div>
          )

        case 'rooms':
          return (
            <div className="text-gray2 flex items-center gap-2">
              <RoomIcon roomType="turtle" />
              <span className="text-xs">Baby turtles</span>
            </div>
          )

        case 'role':
          return <span className="text-xs">{staff.role}</span>

        case 'email':
          return <span className="text-gray2 text-xs">{staff.email}</span>

        case 'pin':
          if (staff.isCurrentUser) {
            return (
              <Chip
                className="bg-gray-100 p-0! text-gray-800"
                classNames={{
                  base: 'p-0!',
                  content: 'p-0!',
                }}
                size="sm"
              >
                {staff.pin}
              </Chip>
            )
          }

          return isVisible ? (
            <Chip
              className="cursor-pointer bg-gray-100 p-0! text-gray-800"
              classNames={{
                base: 'p-0!',
                content: 'p-0!',
              }}
              onClick={() => togglePinVisibility(staff.id)}
              size="sm"
            >
              {staff.pin}
            </Chip>
          ) : (
            <Button
              className="text-wine-700 bg-[#792C4133] text-[11px] font-semibold"
              onPress={() => {
                togglePinVisibility(staff.id)
              }}
              size="sm"
            >
              Reveal
            </Button>
          )

        default:
          return null
      }
    },
    [isPinVisible, togglePinVisibility],
  )

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table
        aria-label="Staff members table"
        classNames={{
          wrapper: 'min-w-full p-0 shadow-none! bg-transparent',
          base: 'p-0',
          table: 'border-spacing-y-2!',
          th: 'p-0 pb-7 bg-transparent text-xs!',
          td: 'p-0 py-2.5',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className="text-gray2 text-left text-sm font-medium tracking-wider"
              key={column.key}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={staffMembers}>
          {(staff) => (
            <TableRow key={staff.id}>
              {(columnKey) => (
                <TableCell align="left" className="whitespace-nowrap">
                  {renderCell(staff, columnKey as string)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default StaffTable

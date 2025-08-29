import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import createStaffColumns from './StaffTableConfig'
import DataTable from '@/components/DataTable'
import usePinVisibility from '@/hooks/usePinVisibility'
import { getStaffMembers } from '@/services/staff.service'

const StaffTable = () => {
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: getStaffMembers,
  })

  const { isPinVisible, togglePinVisibility } = usePinVisibility()

  const columns = useMemo(
    () => createStaffColumns({ isPinVisible, togglePinVisibility }),
    [isPinVisible, togglePinVisibility],
  )

  return (
    <DataTable
      columns={columns}
      data={staffMembers}
      emptyMessage="No staff members found"
      getRowKey={(staff) => staff.id}
      isLoading={isLoading}
    />
  )
}

export default StaffTable

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import createRoomsColumns from './RoomsTableConfig'
import DataTable from '@/components/DataTable'
import { getRooms } from '@/services/room.service'

const RoomsTable = () => {
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
  })

  const columns = useMemo(() => createRoomsColumns(), [])

  return (
    <DataTable
      columns={columns}
      data={rooms}
      emptyMessage="No rooms found"
      getRowKey={(room) => room.id}
      isLoading={isLoading}
    />
  )
}

export default RoomsTable

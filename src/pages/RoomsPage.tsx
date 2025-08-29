import RoomsTable from '@/components/RoomsTable'
import SubHeader from '@/components/SubHeader'

const roomsFilters = [
  {
    id: 'capacity',
    label: 'Capacity',
    value: '',
    options: [
      { value: '', label: 'All Capacities' },
      { value: '1-10', label: '1-10 Students' },
      { value: '11-20', label: '11-20 Students' },
      { value: '21+', label: '21+ Students' },
    ],
  },
  {
    id: 'occupancy',
    label: 'Occupancy',
    value: '',
    options: [
      { value: '', label: 'All' },
      { value: 'empty', label: 'Empty' },
      { value: 'partial', label: 'Partially Filled' },
      { value: 'full', label: 'Full' },
    ],
  },
  {
    id: 'roomType',
    label: 'Room Type',
    value: '',
    options: [
      { value: '', label: 'All Rooms' },
      { value: 'turtle', label: 'Baby Turtles' },
      { value: 'rabbit', label: 'Happy Rabbits' },
      { value: 'bear', label: 'Curious Bears' },
      { value: 'butterfly', label: 'Bright Butterflies' },
      { value: 'owl', label: 'Wise Owls' },
      { value: 'fox', label: 'Clever Foxes' },
    ],
  },
]

const RoomsPage = () => {
  return (
    <>
      <SubHeader initialFilters={roomsFilters} />
      <main className="container max-w-7xl pt-10">
        <RoomsTable />
      </main>
    </>
  )
}

export default RoomsPage

import { Avatar, Tab, Tabs } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import DataTable from '@/components/DataTable'
import Filters from '@/components/Filters'
import SubHeader from '@/components/SubHeader'
import { Route as MessagesRoute } from '@/routes/_authenticated/messages'

import type { TableColumn } from '@/types/table'
import type { FilterProps } from '@/types/TableFilters'

type TabKey = 'parents' | 'rooms'

const messagesFilters = [
  {
    id: 'rooms',
    label: 'Rooms',
    value: '',
    options: [
      { value: '', label: 'All Rooms' },
      { value: '1-10', label: 'Room 1' },
      { value: '11-20', label: 'Room 2' },
      { value: '21+', label: 'Room 3' },
    ],
  },
]

const MessagesPage = () => {
  const search = MessagesRoute.useSearch()
  const navigate = useNavigate({ from: MessagesRoute.fullPath })

  const [filters, setFilters] = useState<FilterProps[]>(messagesFilters)

  const handleFilterChange = (filterId: string, newValue: string) => {
    setFilters((prevFilters) =>
      prevFilters.map((filter) =>
        filter.id === filterId ? { ...filter, value: newValue } : filter,
      ),
    )
  }

  const tab = search.tab

  const handleTabChange = (key: React.Key) => {
    const next = String(key) as TabKey
    void navigate({
      replace: true,
      search: (prev: Record<string, unknown>) => ({ ...prev, tab: next }),
    })
  }

  return (
    <div>
      <SubHeader
        bottomSlot={
          <>
            <Tabs
              aria-label="Messages tabs"
              classNames={{
                tabList: 'p-0 gap-7',
                cursor: 'w-full bg-brand',
                tab: 'p-0 pb-5',
                tabContent:
                  'group-data-[selected=true]:text-brand text-neutral-700 font-medium',
              }}
              onSelectionChange={handleTabChange}
              selectedKey={tab}
              variant="underlined"
            >
              <Tab key="parents" title="Parents" />
              <Tab key="rooms" title="Rooms" />
            </Tabs>
            <Filters filters={filters} onFilterChange={handleFilterChange} />
          </>
        }
      />

      <div className="container max-w-4xl pt-10.5">
        {tab === 'parents' && <ParentsMessagesTable />}
        {tab === 'rooms' && <SentPanel />}
      </div>
    </div>
  )
}

const PanelBox = ({ title }: { title: string }) => (
  <div className="rounded-lg border bg-white p-6 shadow-sm">
    <h2 className="mb-2 text-xl font-semibold">{title}</h2>
    <p className="text-default-500 text-sm">Content goes here…</p>
  </div>
)

// Messages table (Parents tab)
interface ParentInfo {
  id: string
  name: string
  avatar: string
}
interface StudentInfo {
  name: string
  avatar: string
  unread?: boolean
  online?: boolean
}

interface MessageRow {
  id: string
  student: StudentInfo
  parents: ParentInfo[]
  preview: string
  time: string
}

const messagesData: MessageRow[] = [
  {
    id: 'm1',
    student: {
      name: 'James Whitaker',
      avatar:
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=faces',
      unread: true,
      online: true,
    },
    parents: [
      {
        id: 'p1',
        name: 'Parent 1',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=64&h=64&fit=crop&crop=faces',
      },
    ],
    preview:
      'Dear Jln, Just a quick reminder to please pack a hat and sunscreen for your child today—we’re planning to spend some time outside…',
    time: '10:36 AM',
  },
  {
    id: 'm2',
    student: {
      name: 'Emily Carter',
      avatar:
        'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=80&h=80&fit=crop&crop=faces',
      online: true,
    },
    parents: [
      {
        id: 'p2',
        name: 'Daniel Carter',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
      },
      {
        id: 'p3',
        name: 'Parent 2',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=faces',
      },
    ],
    preview:
      'Dear Daniel, Emily had a wonderful day today! She really enjoyed the painting activity and shared so nicely with her friends. You should be very…',
    time: '10:36 AM',
  },
  {
    id: 'm3',
    student: {
      name: 'Mia Caldwell',
      avatar:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=faces',
      unread: true,
    },
    parents: [
      {
        id: 'p4',
        name: 'Parent 3',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces',
      },
    ],
    preview:
      'Dear Jln, Just a quick reminder to please pack a hat and sunscreen for your child today—we’re planning to spend some time outside…',
    time: '10:36 AM',
  },
  {
    id: 'm4',
    student: {
      name: 'Olivia Hayes',
      avatar:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&h=80&fit=crop&crop=faces',
      online: true,
    },
    parents: [
      {
        id: 'p5',
        name: 'Parent 4',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces',
      },
      {
        id: 'p6',
        name: 'Parent 5',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=faces',
      },
    ],
    preview:
      'Dear James, Olivia had a wonderful day today! She really enjoyed the painting activity and shared so nicely with her friends. You should be very…',
    time: '10:36 AM',
  },
  {
    id: 'm5',
    student: {
      name: 'Sophie Bennett',
      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop&crop=faces',
    },
    parents: [
      {
        id: 'p7',
        name: 'Parent 6',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=64&h=64&fit=crop&crop=faces',
      },
      {
        id: 'p8',
        name: 'Parent 7',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces',
      },
    ],
    preview: '',
    time: '',
  },
]

const columns: TableColumn<MessageRow>[] = [
  {
    key: 'student',
    label: 'Students',
    renderCell: (row) => (
      <div className="flex items-center gap-3">
        {/* Unread dot */}
        <span
          className={`h-2.5 w-2.5 rounded-full ${row.student.unread ? 'bg-brand' : 'bg-transparent'}`}
        />
        <div className="relative">
          <Avatar className="h-8 w-8" showFallback src={row.student.avatar} />
          {row.student.online && (
            <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full border border-white bg-green-500" />
          )}
        </div>
        <span className="font-medium">{row.student.name}</span>
      </div>
    ),
  },
  {
    key: 'parents',
    label: 'Parents',
    renderCell: (row) => (
      <div className="flex -space-x-2">
        {row.parents.map((p) => (
          <Avatar
            className="h-7 w-7 ring-2 ring-white"
            key={p.id}
            showFallback
            src={p.avatar}
          />
        ))}
      </div>
    ),
  },
  {
    key: 'preview',
    label: 'Messages',
    renderCell: (row) => (
      <div className="text-default-500 max-w-[640px] truncate">
        {row.preview || '—'}
      </div>
    ),
  },
  {
    key: 'time',
    label: '',
    align: 'end',
    renderCell: (row) => (
      <span className="text-default-400 text-sm">{row.time}</span>
    ),
  },
]

const ParentsMessagesTable = () => (
  <DataTable<MessageRow>
    columns={columns}
    data={messagesData}
    emptyMessage="No messages"
    getRowKey={(r) => r.id}
    tableClassName="[&_tr]:border-b [&_tr]:border-gray-100"
  />
)

const SentPanel = () => <PanelBox title="Sent" />

export default MessagesPage

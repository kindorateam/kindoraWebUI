import { Tab, Tabs } from '@heroui/react'

import SubHeader from '@/components/SubHeader'

// const messagesFilters = [
//   {
//     id: 'rooms',
//     label: 'Rooms',
//     value: '',
//     options: [
//       { value: '', label: 'All Rooms' },
//       { value: 'turtle', label: 'Baby Turtles' },
//       { value: 'rabbit', label: 'Happy Rabbits' },
//       { value: 'bear', label: 'Curious Bears' },
//       { value: 'butterfly', label: 'Bright Butterflies' },
//       { value: 'owl', label: 'Wise Owls' },
//       { value: 'fox', label: 'Clever Foxes' },
//     ],
//   },
// ]

const MessagesPage = () => {
  return (
    <div>
      <SubHeader />
      <Tabs
        aria-label="Student details tabs"
        classNames={{
          tabList: 'gap-4',
          cursor: 'w-full',
          tab: 'p-0',
        }}
        onSelectionChange={(key) => handleTabChange(key as TabType)}
        selectedKey={tab}
        variant="underlined"
      >
        <Tab key="activity" title="Activity" />
        <Tab key="profile" title="Profile" />
        <Tab key="documents" title="Documents" />
        <Tab key="immunization" title="Immunization" />
        <Tab key="billing" title="Billing" />
      </Tabs>
    </div>
  )
}

export default MessagesPage

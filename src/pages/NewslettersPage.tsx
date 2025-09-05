import { Button, Tab, Tabs } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'

import SubHeader from '@/components/SubHeader'
import { Route as NewslettersRoute } from '@/routes/_authenticated/newsletters'

type TabKey = 'drafts' | 'scheduled' | 'sent'

const NewslettersPage = () => {
  const search = NewslettersRoute.useSearch()
  const navigate = useNavigate({ from: NewslettersRoute.fullPath })

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
          <Tabs
            aria-label="Newsletters tabs"
            classNames={{ tabList: 'gap-4', cursor: 'w-full', tab: 'p-0' }}
            onSelectionChange={handleTabChange}
            selectedKey={tab}
            variant="underlined"
          >
            <Tab key="sent" title="Sent" />
            <Tab key="scheduled" title="Scheduled" />
            <Tab key="drafts" title="Drafts" />
          </Tabs>
        }
        endSlot={<Button>Create New</Button>}
      />

      <div className="mt-6">
        {tab === 'sent' && <PanelBox title="Sent" />}
        {tab === 'scheduled' && 123}
        {tab === 'drafts' && 123}
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

export default NewslettersPage

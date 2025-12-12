import { Tab, Tabs, useDisclosure } from "@heroui/react"

import SubHeader from "@/components/SubHeader"
import CreateNewsletterModal from "@/features/newsletters/components/CreateNewsletterModal"
import NewslettersTable from "@/features/newsletters/components/NewslettersTable"

type TabKey = "drafts" | "scheduled" | "sent"

interface NewslettersPageProps {
	activeTab: TabKey
	onTabChange: (tab: TabKey) => void
}

const NewslettersPage = ({ activeTab, onTabChange }: NewslettersPageProps) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<div>
			<SubHeader
				bottomSlot={
					<Tabs
						aria-label="Newsletters tabs"
						classNames={{ tabList: "shadow-md" }}
						color="primary"
						onSelectionChange={(key) => onTabChange(key as TabKey)}
						radius="sm"
						selectedKey={activeTab}
						size="sm"
						variant="solid"
					>
						<Tab key="sent" title="Sent" />
						<Tab key="scheduled" title="Scheduled" />
						<Tab key="drafts" title="Drafts" />
					</Tabs>
				}
			/>

			<div className="container mx-auto max-w-4xl px-4 pt-10.5">
				{activeTab === "sent" && <NewslettersTable onCreateNew={onOpen} />}
				{activeTab === "scheduled" && null}
				{activeTab === "drafts" && null}
			</div>

			<CreateNewsletterModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</div>
	)
}

export default NewslettersPage

import { Tabs } from "@heroui/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import SubHeader from "@/components/SubHeader"

import CreateNewsletterModal from "./CreateNewsletterModal"
import NewslettersTable from "./NewslettersTable"

type TabKey = "drafts" | "scheduled" | "sent"

interface NewslettersPageProps {
	activeTab: TabKey
	onTabChange: (tab: TabKey) => void
}

export default function NewslettersPage({ activeTab, onTabChange }: NewslettersPageProps) {
	const { t } = useTranslation()
	const [isOpen, setIsOpen] = useState(false)
	const onOpen = () => setIsOpen(true)
	const onOpenChange = setIsOpen

	return (
		<div>
			<SubHeader
				bottomSlot={
					<Tabs selectedKey={activeTab} onSelectionChange={(key) => onTabChange(key as TabKey)}>
						<Tabs.ListContainer>
							<Tabs.List
								aria-label={t("newsletters.tabs.ariaLabel")}
								className="w-fit *:h-6 *:w-fit *:px-3 *:font-normal *:text-sm *:data-[selected=true]:text-accent-foreground"
							>
								<Tabs.Tab id="sent">
									{t("newsletters.tabs.sent")}
									<Tabs.Indicator className="bg-accent" />
								</Tabs.Tab>
								<Tabs.Tab id="scheduled">
									{t("newsletters.tabs.scheduled")}
									<Tabs.Indicator className="bg-accent" />
								</Tabs.Tab>
								<Tabs.Tab id="drafts">
									{t("newsletters.tabs.drafts")}
									<Tabs.Indicator className="bg-accent" />
								</Tabs.Tab>
							</Tabs.List>
						</Tabs.ListContainer>
						<Tabs.Panel id="sent" className="hidden">
							{null}
						</Tabs.Panel>
						<Tabs.Panel id="scheduled" className="hidden">
							{null}
						</Tabs.Panel>
						<Tabs.Panel id="drafts" className="hidden">
							{null}
						</Tabs.Panel>
					</Tabs>
				}
			/>

			<div className="container mx-auto max-w-4xl pt-6">
				{activeTab === "sent" && <NewslettersTable onCreateNew={onOpen} />}
				{activeTab === "scheduled" && null}
				{activeTab === "drafts" && null}
			</div>

			<CreateNewsletterModal isOpen={isOpen} onOpenChange={onOpenChange} />
		</div>
	)
}

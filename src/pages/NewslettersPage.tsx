import { Tab, Tabs } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"

import Button from "@/components/Button"
import DataTable from "@/components/DataTable"
import NewsIcon from "@/components/icons/NewsIcon"
import NewsIconAdd from "@/components/icons/NewsIconAdd"
import SubHeader from "@/components/SubHeader"
import Text from "@/components/Text"
import { useTabNavigation } from "@/hooks/useTabNavigation"
import { Route as NewslettersRoute } from "@/routes/_authenticated/newsletters"

type TabKey = "drafts" | "scheduled" | "sent"

interface Newsletter {
	id: string
	title: string
	sentDate: string
}

const newslettersData: Newsletter[] = [
	{ id: "n1", title: "Little Explorers Weekly", sentDate: "08.05.2025" },
	{ id: "n2", title: "Tiny Steps, Big Adventures", sentDate: "09.05.2025" },
	{ id: "n3", title: "Peek Inside Our Preschool", sentDate: "10.05.2025" },
	{ id: "n4", title: "Sunshine & Smiles Update", sentDate: "11.05.2025" },
	{
		id: "n5",
		title: "From Our Classroom to Your Home",
		sentDate: "12.05.2025",
	},
]

const NewslettersPage = () => {
	const search = NewslettersRoute.useSearch()
	const navigate = useNavigate({ from: NewslettersRoute.fullPath })

	const tab = search.tab

	const handleTabChange = useTabNavigation(tab, "sent", navigate)

	return (
		<div>
			<SubHeader
				bottomSlot={
					<Tabs
						aria-label="Newsletters tabs"
						classNames={{
							tabList: "p-0 gap-7",
							cursor: "w-full bg-brand",
							tab: "p-0 pb-5",
							tabContent: "group-data-[selected=true]:text-brand text-neutral-700 font-medium",
						}}
						onSelectionChange={(key) => handleTabChange(key as TabKey)}
						selectedKey={tab}
						variant="underlined"
					>
						<Tab key="sent" title="Sent" />
						<Tab key="scheduled" title="Scheduled" />
						<Tab key="drafts" title="Drafts" />
					</Tabs>
				}
				endSlot={
					<Button color="primary" startContent={<NewsIconAdd />}>
						Create New
					</Button>
				}
			/>

			<div className="container max-w-4xl pt-10.5">
				{tab === "sent" && (
					<DataTable<Newsletter>
						columns={[
							{
								key: "title",
								label: "Title",
								renderCell: (item) => (
									<div className="flex items-center gap-3">
										<div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
											<NewsIcon />
										</div>
										<Text color="black" size={14}>
											{item.title}
										</Text>
									</div>
								),
							},
							{
								key: "sentDate",
								label: "Sent date",
								renderCell: (item) => (
									<Text color="neutral-500" size={12}>
										{item.sentDate}
									</Text>
								),
							},
						]}
						data={newslettersData}
						emptyMessage="No newsletters sent"
						getRowKey={(n) => n.id}
						tableClassName="[&_tr]:border-b [&_tr]:border-gray-100"
					/>
				)}
				{tab === "scheduled" && null}
				{tab === "drafts" && null}
			</div>
		</div>
	)
}

export default NewslettersPage

import {
	Button,
	Card,
	CardBody,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react"

import TablerCirclePlusFilled from "~icons/tabler/circle-plus-filled"

import columns from "./columns"
import { renderCell } from "./renderCell"

import type { Newsletter } from "../../types"

interface NewslettersTableProps {
	onCreateNew: () => void
}

// Mock data - will be replaced with API call
const newslettersData: Newsletter[] = [
	{ id: "n1", title: "Little Explorers Weekly", sentDate: "08.05.2025", status: "sent" },
	{ id: "n2", title: "Tiny Steps, Big Adventures", sentDate: "09.05.2025", status: "sent" },
	{ id: "n3", title: "Peek Inside Our Preschool", sentDate: "10.05.2025", status: "sent" },
	{ id: "n4", title: "Sunshine & Smiles Update", sentDate: "11.05.2025", status: "sent" },
	{ id: "n5", title: "From Our Classroom to Your Home", sentDate: "12.05.2025", status: "sent" },
]

const NewslettersTable = ({ onCreateNew }: NewslettersTableProps) => {
	const newsletters = newslettersData
	const isLoading = false

	return (
		<Card>
			<CardBody className="p-4">
				<Table
					aria-label="Newsletters table"
					removeWrapper
					topContent={
						<div className="flex items-center justify-end">
							<Button
								color="primary"
								endContent={<TablerCirclePlusFilled className="size-5 text-white" />}
								onPress={onCreateNew}
							>
								Create New
							</Button>
						</div>
					}
					topContentPlacement="outside"
					classNames={{
						tr: "border-b border-default-200 last:border-b-0",
						td: "p-0",
						tbody: "[&>tr]:h-[55px]",
					}}
				>
					<TableHeader columns={columns}>
						{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
					</TableHeader>
					<TableBody
						emptyContent="No newsletters sent"
						items={isLoading ? [] : newsletters}
						isLoading={isLoading}
						loadingContent={<Spinner size="lg" />}
					>
						{(newsletter) => (
							<TableRow key={newsletter.id}>
								{(columnKey) => <TableCell>{renderCell(newsletter, columnKey)}</TableCell>}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	)
}

export default NewslettersTable

import { Button, Card, Spinner, Table } from "@heroui/react"

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
			<Card.Content className="p-4">
				<div className="mb-2 flex items-center justify-end">
					<Button variant="primary" onPress={onCreateNew}>
						Create New
					</Button>
				</div>
				<Table aria-label="Newsletters table">
					<Table.ScrollContainer>
						<Table.Content className="min-w-[500px]">
							<Table.Header>
								{columns.map((column) => (
									<Table.Column key={column.key}>{column.label}</Table.Column>
								))}
							</Table.Header>
							<Table.Body>
								{newsletters.length === 0 ? (
									<Table.Row>
										<Table.Cell colSpan={columns.length}>
											<div className="py-8 text-center text-default-400">No newsletters sent</div>
										</Table.Cell>
									</Table.Row>
								) : (
									newsletters.map((newsletter) => (
										<Table.Row key={newsletter.id}>
											{columns.map((column) => (
												<Table.Cell key={column.key}>{renderCell(newsletter, column.key)}</Table.Cell>
											))}
										</Table.Row>
									))
								)}
							</Table.Body>
						</Table.Content>
					</Table.ScrollContainer>
				</Table>
				{isLoading && (
					<div className="flex justify-center py-8">
						<Spinner size="lg" />
					</div>
				)}
			</Card.Content>
		</Card>
	)
}

export default NewslettersTable

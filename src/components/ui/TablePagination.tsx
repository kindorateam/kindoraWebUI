import { Pagination } from "@heroui/react"
import { useTranslation } from "react-i18next"

interface TablePaginationProps {
	onPageChange: (page: number) => void
	page: number
	summary: React.ReactNode
	totalPages: number
}

const TablePagination = ({ onPageChange, page, summary, totalPages }: TablePaginationProps) => {
	const { t } = useTranslation()

	return (
		<Pagination className="w-full">
			<Pagination.Summary>{summary}</Pagination.Summary>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous isDisabled={page <= 1} onPress={() => onPageChange(page - 1)}>
						<Pagination.PreviousIcon />
						<span>{t("common.previous")}</span>
					</Pagination.Previous>
				</Pagination.Item>
				{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
					<Pagination.Item key={pageNumber}>
						<Pagination.Link isActive={pageNumber === page} onPress={() => onPageChange(pageNumber)}>
							{pageNumber}
						</Pagination.Link>
					</Pagination.Item>
				))}
				<Pagination.Item>
					<Pagination.Next isDisabled={page >= totalPages} onPress={() => onPageChange(page + 1)}>
						<span>{t("common.next")}</span>
						<Pagination.NextIcon />
					</Pagination.Next>
				</Pagination.Item>
			</Pagination.Content>
		</Pagination>
	)
}

export default TablePagination

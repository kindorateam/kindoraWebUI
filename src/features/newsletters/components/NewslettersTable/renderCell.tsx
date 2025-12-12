import NewsIcon from "../icons/NewsIcon"

import type { Newsletter } from "../../types"

export function renderCell(newsletter: Newsletter, columnKey: React.Key) {
	switch (columnKey) {
		case "title":
			return (
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
						<NewsIcon />
					</div>
					<span className="font-medium text-sm">{newsletter.title}</span>
				</div>
			)

		case "sentDate":
			return <span className="text-gray-500 text-sm">{newsletter.sentDate}</span>

		default:
			return null
	}
}

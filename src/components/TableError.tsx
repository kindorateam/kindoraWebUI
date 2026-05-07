import { Button } from "@heroui/react"
import { useTranslation } from "react-i18next"

import StreamlineEmojisCloudWithRain2 from "~icons/streamline-emojis/cloud-with-rain-2"

interface TableErrorProps {
	onRetry?: () => void
}

const TableError = ({ onRetry }: TableErrorProps) => {
	const { t } = useTranslation()

	return (
		<div className="mx-auto flex max-w-113 flex-col items-center gap-5 px-7 py-8 text-center">
			<div className="relative h-22.25 w-20 overflow-clip">
				<StreamlineEmojisCloudWithRain2 aria-hidden className="size-full text-warning-500" />
			</div>

			<div className="flex max-w-xl flex-col gap-5">
				<h3 className="font-semibold text-3xl leading-9">{t("tableError.title")}</h3>
				<div>
					<p className="text-default-700 text-lg leading-7">{t("tableError.description")}</p>
				</div>
			</div>

			{onRetry && (
				<Button className="w-full" variant="primary" onPress={onRetry} size="lg">
					{t("tableError.retry")}
				</Button>
			)}
		</div>
	)
}

export default TableError

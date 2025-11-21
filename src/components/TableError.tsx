import { Button, Card, CardBody } from "@heroui/react"
import { Icon } from "@iconify/react"

import Text from "./Text"

interface TableErrorProps {
	title?: string
	message?: string
	onRetry?: () => void
}

const TableError = ({
	title = "We couldn't load your table",
	message = "There was a problem connecting to our server. Some data may be missing.",
	onRetry,
}: TableErrorProps) => {
	return (
		<Card className="w-full">
			<CardBody className="items-center gap-4 py-10 text-center">
				<div className="flex size-12 items-center justify-center rounded-full bg-danger-50 text-danger">
					<Icon aria-hidden className="size-6" icon="solar:cloud-error-outline" />
				</div>

				<div className="flex max-w-xl flex-col gap-1">
					<Text as="h3" className="text-xl" weight="semibold">
						{title}
					</Text>
					<Text className="text-default-500" size={16}>
						{message}
					</Text>
				</div>

				{onRetry && (
					<Button
						color="primary"
						onPress={onRetry}
						startContent={<Icon aria-hidden className="size-5" icon="solar:refresh-line-duotone" />}
						variant="solid"
					>
						Try again
					</Button>
				)}
			</CardBody>
		</Card>
	)
}

export default TableError

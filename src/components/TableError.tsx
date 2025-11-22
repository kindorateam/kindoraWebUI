import { Button, Card, CardBody } from "@heroui/react"
import { Icon } from "@iconify/react"

interface TableErrorProps {
	onRetry?: () => void
}

const TableError = ({ onRetry }: TableErrorProps) => {
	return (
		<Card className="w-full">
			<CardBody className="items-center gap-5 px-7 py-8 text-center">
				<div className="relative h-[89px] w-20 overflow-clip">
					<Icon aria-hidden className="size-full text-warning-500" icon="streamline-emojis:cloud-with-rain-2" />
				</div>

				<div className="flex max-w-xl flex-col gap-5">
					<h3 className="font-semibold text-3xl leading-9">We couldn’t load the data.</h3>
					<div>
						<p className="text-default-700 text-lg leading-7">Try refreshing the page or checking your connection.</p>
					</div>
				</div>

				{onRetry && (
					<Button
						className="w-full"
						color="primary"
						endContent={<Icon aria-hidden className="size-5" icon="tabler:refresh" />}
						onPress={onRetry}
						size="lg"
						variant="solid"
					>
						Try Again
					</Button>
				)}
			</CardBody>
		</Card>
	)
}

export default TableError

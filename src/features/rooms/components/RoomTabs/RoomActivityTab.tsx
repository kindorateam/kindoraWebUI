import { Card, CardBody } from "@heroui/react"

interface RoomActivityTabProps {
	roomId: string
}

const RoomActivityTab = ({ roomId: _roomId }: RoomActivityTabProps) => {
	return (
		<Card>
			<CardBody className="flex min-h-40 items-center justify-center">
				<p className="text-default-400 text-sm">Activity is coming soon.</p>
			</CardBody>
		</Card>
	)
}

export default RoomActivityTab

import { Card } from "@heroui/react"

interface RoomActivityTabProps {
	roomId: string
}

const RoomActivityTab = ({ roomId: _roomId }: RoomActivityTabProps) => {
	return (
		<Card>
			<Card.Content className="flex min-h-40 items-center justify-center">
				<p className="text-default-400 text-sm">Activity is coming soon.</p>
			</Card.Content>
		</Card>
	)
}

export default RoomActivityTab

import { Card, CardBody, CardHeader } from "@heroui/react"

interface RoomActivityTabProps {
	roomId: string
}

const RoomActivityTab = ({ roomId }: RoomActivityTabProps) => {
	return (
		<div className="space-y-4">
			<h2 className="font-semibold text-xl">Activity Log - Room {roomId}</h2>

			<Card>
				<CardHeader>
					<h3 className="font-medium text-lg">Recent Activity</h3>
				</CardHeader>
				<CardBody>
					<div className="space-y-3">
						<p className="text-gray-600">Activity tracking for Room {roomId} will be displayed here.</p>
						<ul className="space-y-2 text-sm">
							<li className="border-primary border-l-2 pl-3">
								<span className="font-medium">10:30 AM</span> - Student checked in
							</li>
							<li className="border-primary border-l-2 pl-3">
								<span className="font-medium">9:15 AM</span> - Morning activity started
							</li>
							<li className="border-primary border-l-2 pl-3">
								<span className="font-medium">8:45 AM</span> - Room opened
							</li>
						</ul>
					</div>
				</CardBody>
			</Card>
		</div>
	)
}

export default RoomActivityTab

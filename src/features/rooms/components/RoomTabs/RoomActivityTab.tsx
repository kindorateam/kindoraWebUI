import { Card } from "@heroui/react"
import { useTranslation } from "react-i18next"

interface RoomActivityTabProps {
	roomId: string
}

const RoomActivityTab = ({ roomId: _roomId }: RoomActivityTabProps) => {
	const { t } = useTranslation()

	return (
		<Card>
			<Card.Content className="flex min-h-40 items-center justify-center">
				<p className="text-default-400 text-sm">{t("rooms.detail.activityComingSoon")}</p>
			</Card.Content>
		</Card>
	)
}

export default RoomActivityTab

import { Card, CardBody, CardHeader } from "@heroui/react"

import type { ReactNode } from "react"

interface StatsCardProps {
	headerContent?: ReactNode
	bodyContent?: ReactNode
}

const StatsCard = ({ headerContent, bodyContent }: StatsCardProps) => {
	return (
		<Card className="bg-white p-7 shadow-md">
			<CardHeader className="mb-7 flex p-0">{headerContent}</CardHeader>
			<CardBody className="p-0">{bodyContent}</CardBody>
		</Card>
	)
}

export default StatsCard

import { Card, CardBody, Avatar, AvatarGroup } from '@heroui/react'

interface StatsCardProps {
  title: string
  value: number | string
  subValue?: number | string
  label?: string
  avatars?: { id: string; name: string; avatar?: string }[]
  icon?: React.ReactNode
}

const StatsCard = ({
  title,
  value,
  subValue,
  label,
  avatars,
  icon,
}: StatsCardProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardBody className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {icon && <div className="text-gray-600">{icon}</div>}
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {subValue && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-gray-500">{subValue}</span>
                {label && (
                  <span className="text-sm text-gray-500">{label}</span>
                )}
              </div>
            )}
          </div>
          {avatars && avatars.length > 0 && (
            <AvatarGroup max={2} size="sm">
              {avatars.map((user) => (
                <Avatar key={user.id} src={user.avatar} name={user.name} />
              ))}
            </AvatarGroup>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default StatsCard

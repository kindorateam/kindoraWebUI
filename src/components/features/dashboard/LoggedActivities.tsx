import { Card, CardBody, CardHeader, Progress, Chip } from '@heroui/react'

import type { LoggedActivity } from '@/types/dashboard.types'
import type { CSSProperties } from 'react'

interface LoggedActivitiesProps {
  categories: LoggedActivity[]
  details: { id: string; name: string; count: number }[]
}

const LoggedActivities = ({ categories, details }: LoggedActivitiesProps) => {
  const maxCount = Math.max(...categories.map((c) => c.count))

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold">
          Today&apos;s logged activities
        </h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {category.count}
                  </span>
                </div>
                <Progress
                  value={(category.count / maxCount) * 100}
                  color="primary"
                  size="sm"
                  aria-label={`${category.name} activity progress: ${category.count} items`}
                  classNames={{
                    indicator: `bg-[${category.color}]`,
                  }}
                  style={
                    {
                      '--progress-color': category.color,
                    } as CSSProperties
                  }
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {details.map((detail) => (
              <div
                key={detail.id}
                className="flex items-center justify-between border-t py-2"
              >
                <span className="text-sm font-medium">{detail.name}</span>
                <Chip size="sm" variant="flat">
                  {detail.count}
                </Chip>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default LoggedActivities

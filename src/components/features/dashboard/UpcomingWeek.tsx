import { Card, CardBody, CardHeader, Button } from '@heroui/react'

import type { CalendarEvent } from '@/types/dashboard.types'

interface UpcomingWeekProps {
  events: CalendarEvent[]
}

const UpcomingWeek = ({ events }: UpcomingWeekProps) => {
  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'artist-visitor':
        return 'bg-purple-100 text-purple-700'
      case 'birthday':
        return 'bg-pink-100 text-pink-700'
      case 'zoo-visit':
        return 'bg-indigo-100 text-indigo-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upcoming this week</h3>
        <Button size="sm" variant="light" color="primary">
          View calendar
        </Button>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    {event.date}
                  </div>
                  <div className="text-2xl font-bold">{event.dayNum}</div>
                </div>
                <div>
                  <div
                    className={`inline-block rounded px-2 py-1 text-xs font-medium ${getEventColor(event.type)}`}
                  >
                    {event.title}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{event.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default UpcomingWeek

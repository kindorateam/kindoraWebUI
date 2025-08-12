import { Card, CardBody, CardHeader, Avatar, Button } from '@heroui/react'

import type { NeedsAttentionItem } from '@/types/dashboard.types'

interface NeedsAttentionProps {
  items: NeedsAttentionItem[]
}

export function NeedsAttention({ items }: NeedsAttentionProps) {
  const getStatusColor = (type: NeedsAttentionItem['type']) => {
    switch (type) {
      case 'absence':
        return 'text-orange-600'
      case 'incomplete':
        return 'text-yellow-600'
      case 'incident':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <h3 className="text-lg font-semibold">Needs attention</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Avatar src={item.avatar} name={item.name} size="sm" />
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className={`text-xs ${getStatusColor(item.type)}`}>
                    {item.status}
                  </div>
                </div>
              </div>
              <Button size="sm" variant="light" color="primary">
                View more
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

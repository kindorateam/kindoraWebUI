import { Card, CardBody, Button } from '@heroui/react'

import type { PaymentInfo } from '@/types/dashboard.types'

interface PaymentsCardProps {
  payments: PaymentInfo
}

export function PaymentsCard({ payments }: PaymentsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payments</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-sm">
          <CardBody className="p-6">
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(payments.received)}
            </div>
            <div className="mt-1 text-sm text-gray-500">Received</div>
            <Button size="sm" variant="light" color="primary" className="mt-4">
              See payments
            </Button>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardBody className="p-6">
            <div className="text-3xl font-bold text-gray-900">
              -{formatCurrency(payments.outstanding)}
            </div>
            <div className="mt-1 text-sm text-gray-500">Total outstanding</div>
            <Button size="sm" variant="light" color="primary" className="mt-4">
              See debt collection
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

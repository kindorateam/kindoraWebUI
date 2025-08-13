import { Button } from '@heroui/react'

import { AlertTriangleIcon, RefreshIcon } from '@/components/icons'
import { getUserMessage } from '@/utils/error.utils'

import type { ErrorFallbackProps } from '@/types/error.types'

const CompactErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangleIcon className="text-warning mb-4 h-12 w-12" />
      <h3 className="mb-2 text-lg font-semibold">Something went wrong</h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {getUserMessage(error)}
      </p>
      <Button
        size="sm"
        color="primary"
        variant="flat"
        onPress={resetError}
        startContent={<RefreshIcon className="h-4 w-4" />}
      >
        Try Again
      </Button>
    </div>
  )
}

export default CompactErrorFallback

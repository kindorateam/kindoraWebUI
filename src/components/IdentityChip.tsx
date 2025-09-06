import { Avatar } from '@heroui/react'
import clsx from 'clsx'

interface IdentityChipProps {
  fullName: string
  src?: string
}

const IdentityChip = ({ fullName, src }: IdentityChipProps) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-2 rounded-[50px] bg-[#0000000D] py-1.25 ps-1.25 pe-3',
      )}
    >
      <Avatar className="h-6 w-6" fallback src={src} />
      <span>{fullName}</span>
    </div>
  )
}

export default IdentityChip

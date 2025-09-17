import { Avatar, Chip } from '@heroui/react'

interface IdentityChipProps {
  fullName: string
  src?: string
}

const IdentityChip = ({ fullName, src }: IdentityChipProps) => {
  return (
    <Chip
      avatar={<Avatar fallback src={src} />}
      className="hover:bg-brand/5 hover:text-brand text-sm"
      size="lg"
      variant="flat"
    >
      {fullName}
    </Chip>
  )
}

export default IdentityChip

import { Avatar } from '@heroui/react'

import Chip from './Chip'
import Text from './Text'

const ParentCard = () => {
  return (
    <div className="mb-7 flex">
      <div className="mr-3.5">
        <Avatar
          name="John Doe"
          size="md"
          src="https://i.pravatar.cc/150?img=3"
        />
      </div>
      <div className="pt-2.5">
        <Text as="h4" weight="semibold">
          John Doe
        </Text>

        <div className="grid grid-cols-[36px_1fr] items-center gap-x-2.5 gap-y-2 text-base leading-none">
          <Text as="span" color="neutral-500" size={12} weight="regular">
            Email
          </Text>
          <Text as="span" color="brand" size={12} weight="regular">
            j.hayes@example.com
          </Text>
          <Text as="span" color="neutral-500" size={12} weight="regular">
            Phone
          </Text>
          <Text as="span" color="black" size={12} weight="regular">
            (415) 555-5678
          </Text>
          <Text as="span" color="neutral-500" size={12} weight="regular">
            Pin
          </Text>

          <Chip className="bg-brand/20! text-[11px] font-semibold!">
            <Text as="span" color="brand" size={11} weight="semibold">
              4423
            </Text>
          </Chip>
        </div>
      </div>
    </div>
  )
}

export default ParentCard

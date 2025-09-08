import { Avatar, Chip } from '@heroui/react'

const ParentCard = () => {
  return (
    <div className="flex">
      <div className="mr-3.5">
        <Avatar
          name="John Doe"
          size="md"
          src="https://i.pravatar.cc/150?img=3"
        />
      </div>
      <div className="pt-2.5">
        <p className="mb-2.5 font-semibold">John Doe</p>
        <div className="flex text-xs">
          <div className="me-2.5 flex flex-col">
            <span className="text-secondary-strong mb-2.5">Email</span>
            <span className="text-secondary-strong mb-2.5">Phone</span>
            <span className="text-secondary-strong">Pin</span>
          </div>
          <div className="flex flex-col">
            <span className="text-brand mb-2.5">j.hayes@example.com</span>
            <span className="mb-2.5 text-black">(415) 555-5678</span>
            <span className="text-brand">
              <Chip>4423</Chip>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentCard

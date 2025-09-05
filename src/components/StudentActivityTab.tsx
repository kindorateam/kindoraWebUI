import {
  // Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from '@heroui/react'

import ParentCard from './ParentCard'

const StudentActivityTab = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-4">
        <Card className="bg-[#00000006] p-6.5">
          <CardHeader className="p-0 text-lg font-semibold">Parents</CardHeader>
          <CardBody className="px-0 py-7">
            <ParentCard />
          </CardBody>
          <CardFooter className="p-0">
            <Button className="w-full">New Message</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="col-span-8">312</div>
    </div>
  )
}

export default StudentActivityTab

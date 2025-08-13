import {
  Button,
  Avatar,
  AvatarGroup,
  Accordion,
  AccordionItem,
} from '@heroui/react'

import ArrowRightOnRectangleIcon from '@/components/icons/ArrowRightOnRectangleIcon'
import CalendarDaysIcon from '@/components/icons/CalendarDaysIcon'
import ChevronDownIcon from '@/components/icons/ChevronDownIcon'
import { useStudentGroupsQuery } from '@/hooks/useStudentsQuery'

import type { Student, StudentGroup } from '@/types/student.types'

const StudentRow = ({ student }: { student: Student }) => {
  return (
    <div className="flex items-center justify-between rounded-lg px-6 py-2 transition-colors hover:bg-[#792c410d]">
      <div className="flex flex-1 items-center gap-10">
        {/* Student Name */}
        <div className="flex w-44 items-center gap-3.5">
          <Avatar
            src={student.avatar}
            name={`${student.firstName} ${student.lastName}`}
            size="sm"
            className="h-9 w-9"
          />
          <span className="text-sm text-black">
            {student.firstName} {student.lastName}
          </span>
        </div>

        {/* Parents */}
        <div className="w-24">
          {student.parents.length > 0 && (
            <AvatarGroup isBordered max={2} size="sm" className="justify-start">
              {student.parents.map((parent) => (
                <Avatar
                  key={parent.id}
                  src={parent.avatar}
                  name={`${parent.firstName} ${parent.lastName}`}
                  size="sm"
                  className="h-6 w-6"
                />
              ))}
            </AvatarGroup>
          )}
        </div>

        {/* Room */}
        <div className="flex w-[90px] items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#40c4aa] text-xs">
            {student.room.emoji}
          </div>
          <span className="text-xs text-[#868686]">{student.room.name}</span>
        </div>

        {/* Tags */}
        <div className="flex min-w-[200px] items-center gap-3.5">
          {student.tags.map((tag) => (
            <span key={tag.id} className="text-xs text-[#868686]">
              {tag.label}
            </span>
          ))}
          {student.tags.length > 2 && (
            <div className="flex gap-0.5">
              <span className="h-0.5 w-0.5 rounded-full bg-[#868686]"></span>
              <span className="h-0.5 w-0.5 rounded-full bg-[#868686]"></span>
              <span className="h-0.5 w-0.5 rounded-full bg-[#868686]"></span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          isIconOnly
          variant="bordered"
          radius="full"
          size="sm"
          className="h-[34px] w-[42px] border-[rgba(0,0,0,0.1)]"
        >
          <CalendarDaysIcon className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          color="danger"
          radius="full"
          size="sm"
          variant="solid"
          className="h-[34px] bg-[#792c41] px-3.5 text-white"
          startContent={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
        >
          Sign out
        </Button>
      </div>
    </div>
  )
}

const StudentGroupSection = ({ group }: { group: StudentGroup }) => {
  return (
    <Accordion defaultExpandedKeys={[group.room.id]} className="px-0">
      <AccordionItem
        key={group.room.id}
        aria-label={group.room.name}
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-neutral-700">
              {group.room.name}
            </span>
            <span className="text-lg font-light text-[#868686]">
              {group.students.length}
            </span>
          </div>
        }
        indicator={<ChevronDownIcon className="h-4 w-4" />}
        classNames={{
          base: 'py-0',
          title: 'text-sm',
          trigger:
            'px-2 py-1.5 h-[52px] hover:bg-[rgba(0,0,0,0.04)] rounded-lg',
          content: 'px-0 pb-2',
        }}
      >
        <div className="flex flex-col">
          {group.students.map((student) => (
            <StudentRow key={student.id} student={student} />
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  )
}

const StudentsListV2 = () => {
  const { data: studentGroups, isLoading, error } = useStudentGroupsQuery()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading students...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">Failed to load students</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f2]">
      <div className="mx-auto max-w-[860px] py-8">
        {/* Column Headers */}
        <div className="mb-4 flex items-center px-8 pb-2">
          <div className="flex flex-1 items-center gap-10">
            <div className="w-44 text-xs text-[#909090]">Students name</div>
            <div className="w-24 text-xs text-[#909090]">Parents</div>
            <div className="w-[90px] text-xs text-[#909090]">Rooms</div>
            <div className="text-center text-xs text-[#909090]">Tags</div>
          </div>
        </div>

        {/* Student Groups */}
        <div className="space-y-0">
          {studentGroups?.map((group) => (
            <StudentGroupSection key={group.room.id} group={group} />
          ))}
        </div>

        {studentGroups?.length === 0 && (
          <div className="flex h-64 items-center justify-center text-gray-500">
            No students found
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentsListV2

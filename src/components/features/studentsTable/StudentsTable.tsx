import { Button, Input, Spinner } from '@heroui/react'
import { useState } from 'react'

import { StudentGroup } from './StudentGroup'
import { useStudentGroupsQuery } from '@/hooks/useStudentsQuery'

export const StudentsTable = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: studentGroups, isLoading, error } = useStudentGroupsQuery()

  // Filter student groups based on search and filters
  const filteredGroups = (studentGroups ?? []).filter((group) => {
    if (group.students.length === 0) return false

    // Apply search filter
    if (searchQuery) {
      const hasMatchingStudent = group.students.some((student) =>
        `${student.firstName} ${student.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
      if (!hasMatchingStudent) return false
    }

    return true
  })

  return (
    <div className="flex h-full flex-col bg-[#f7f7f2]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="px-8 py-6">
          {/* Breadcrumb */}
          <div className="mb-4">
            <span className="text-sm text-gray-500">Students</span>
          </div>

          {/* Main Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">Students</h1>

            <div className="flex items-center gap-4">
              {/* Search */}
              <Input
                placeholder="Search"
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="w-64"
                startContent={
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
              />

              {/* Profile Icon & Notifications */}
              <div className="flex items-center gap-3">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="relative"
                >
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5-5-5 5h5zm0 0v5"
                    />
                  </svg>
                  <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d85175] text-xs text-white">
                    3
                  </div>
                </Button>

                <div className="h-10 w-10 rounded-full bg-gray-300" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500 italic">Filter</span>

            <div className="flex items-center gap-1">
              <span className="text-gray-600">Group by</span>
              <span className="font-semibold text-[#792c41]">Rooms</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-gray-600">Room by</span>
              <span className="font-semibold text-gray-700">None</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-gray-600">Tags by</span>
              <span className="font-semibold text-gray-700">None</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-gray-600">Status by</span>
              <span className="font-semibold text-[#792c41]">Active</span>
            </div>
          </div>

          {/* Column Headers */}
          <div className="mt-6 grid grid-cols-5 gap-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
            <div>Students name</div>
            <div>Parents</div>
            <div>Rooms</div>
            <div className="text-center">Tags</div>
            <div></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <Spinner color="primary" size="lg" />
          </div>
        )}

        {error && (
          <div className="flex h-64 items-center justify-center text-red-500">
            Failed to load students. Please try again later.
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredGroups.map((group) => (
            <StudentGroup key={group.room.id} group={group} />
          ))}

        {!isLoading && !error && filteredGroups.length === 0 && (
          <div className="flex h-64 items-center justify-center text-gray-500">
            No students found matching your criteria.
          </div>
        )}
      </div>
    </div>
  )
}

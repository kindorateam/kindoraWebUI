import { useMemo } from "react"

import createStudentColumns from "./RoomStudentsTabConfig"

import DataTable from "@/components/DataTable"

import type { Student } from "./RoomStudentsTabConfig"

const mockStudents: Student[] = [
	{
		id: "1",
		name: "Emma Johnson",
		avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
		parents: [
			{
				id: "p1",
				name: "Sarah Johnson",
				avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
			},
			{
				id: "p2",
				name: "Mike Johnson",
				avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
			},
		],
		tags: ["Fast learner", "Good memory"],
	},
	{
		id: "2",
		name: "Oliver Smith",
		avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
		parents: [
			{
				id: "p3",
				name: "Lisa Smith",
				avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
			},
		],
		tags: ["Loves drawing", "Creative"],
	},
	{
		id: "3",
		name: "Sophia Brown",
		avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
		parents: [
			{
				id: "p4",
				name: "David Brown",
				avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
			},
			{
				id: "p5",
				name: "Emma Brown",
				avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
			},
		],
		tags: ["Good memory", "Loves singing", "Friendly"],
	},
	{
		id: "4",
		name: "Liam Davis",
		avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
		parents: [
			{
				id: "p6",
				name: "Jennifer Davis",
				avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
			},
		],
		tags: ["Fast learner"],
	},
	{
		id: "5",
		name: "Ava Wilson",
		avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
		parents: [],
		tags: ["Shy", "Loves reading", "Good listener"],
	},
]

const RoomStudentsTab = () => {
	const columns = useMemo(() => createStudentColumns(), [])

	return (
		<DataTable
			columns={columns}
			data={mockStudents}
			emptyMessage="No students found"
			getRowKey={(student) => student.id}
		/>
	)
}

export default RoomStudentsTab

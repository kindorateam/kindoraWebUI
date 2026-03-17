import { createFileRoute } from "@tanstack/react-router"

import StudentsPage from "@/features/students/components/StudentsPage"

export const Route = createFileRoute("/_authenticated/students/")({
	component: StudentsPage,
})

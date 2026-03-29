import { Card } from "@heroui/react"

import GuardiansSection from "./GuardiansSection"
import MedicalInfoSection from "./MedicalInfoSection"
import ParentsSection from "./ParentsSection"
import PersonalInfoSection from "./PersonalInfoSection"
import SiblingsSection from "./SiblingsSection"

import type { Student } from "../../types"

interface StudentProfileTabProps {
	student: Student
}

const StudentProfileTab = ({ student }: StudentProfileTabProps) => {
	return (
		<Card className="p-5">
			<Card.Content className="gap-10 p-0">
				<PersonalInfoSection student={student} />
				<ParentsSection parents={student.parents ?? []} />
				<SiblingsSection siblings={student.siblings ?? []} fallbackRoomTitle={student.room?.title} />
				<GuardiansSection guardians={student.guardians ?? []} />
				<MedicalInfoSection medicalInfo={student.medicalInfo} />
			</Card.Content>
		</Card>
	)
}

export default StudentProfileTab

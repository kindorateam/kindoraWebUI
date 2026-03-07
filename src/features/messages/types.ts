export interface MessageParticipant {
	id: string
	name: string
	avatar?: string
}

export interface MessageRecord {
	id: string
	roomId: string
	roomLabel: string
	studentId: string
	studentName: string
	studentAvatar?: string
	parents: MessageParticipant[]
	preview: string
	time: string
}

export interface MessagesSelectOption {
	key: string
	label: string
}

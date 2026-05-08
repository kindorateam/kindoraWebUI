export const STAFF_ROLES = [
	{
		key: "manager",
		label: "Manager",
		labelKey: "staff.options.roles.manager",
		description: "Full administrative access",
		descriptionKey: "staff.options.roleDescriptions.manager",
	},
	{
		key: "teacher",
		label: "Teacher",
		labelKey: "staff.options.roles.teacher",
		description: "Classroom management and student care",
		descriptionKey: "staff.options.roleDescriptions.teacher",
	},
	{
		key: "assistant",
		label: "Assistant",
		labelKey: "staff.options.roles.assistant",
		description: "Support role for teachers",
		descriptionKey: "staff.options.roleDescriptions.assistant",
	},
	{
		key: "admin",
		label: "Admin",
		labelKey: "staff.options.roles.admin",
		description: "Administrative tasks and records",
		descriptionKey: "staff.options.roleDescriptions.admin",
	},
]

export const US_STATES = [
	{ key: "AL", label: "Alabama" },
	{ key: "AK", label: "Alaska" },
	{ key: "AZ", label: "Arizona" },
	{ key: "AR", label: "Arkansas" },
	{ key: "CA", label: "California" },
	{ key: "CO", label: "Colorado" },
	{ key: "CT", label: "Connecticut" },
	{ key: "DE", label: "Delaware" },
	{ key: "FL", label: "Florida" },
	{ key: "GA", label: "Georgia" },
	{ key: "HI", label: "Hawaii" },
	{ key: "ID", label: "Idaho" },
	{ key: "IL", label: "Illinois" },
	{ key: "IN", label: "Indiana" },
	{ key: "IA", label: "Iowa" },
	{ key: "KS", label: "Kansas" },
	{ key: "KY", label: "Kentucky" },
	{ key: "LA", label: "Louisiana" },
	{ key: "ME", label: "Maine" },
	{ key: "MD", label: "Maryland" },
	{ key: "MA", label: "Massachusetts" },
	{ key: "MI", label: "Michigan" },
	{ key: "MN", label: "Minnesota" },
	{ key: "MS", label: "Mississippi" },
	{ key: "MO", label: "Missouri" },
	{ key: "MT", label: "Montana" },
	{ key: "NE", label: "Nebraska" },
	{ key: "NV", label: "Nevada" },
	{ key: "NH", label: "New Hampshire" },
	{ key: "NJ", label: "New Jersey" },
	{ key: "NM", label: "New Mexico" },
	{ key: "NY", label: "New York" },
	{ key: "NC", label: "North Carolina" },
	{ key: "ND", label: "North Dakota" },
	{ key: "OH", label: "Ohio" },
	{ key: "OK", label: "Oklahoma" },
	{ key: "OR", label: "Oregon" },
	{ key: "PA", label: "Pennsylvania" },
	{ key: "RI", label: "Rhode Island" },
	{ key: "SC", label: "South Carolina" },
	{ key: "SD", label: "South Dakota" },
	{ key: "TN", label: "Tennessee" },
	{ key: "TX", label: "Texas" },
	{ key: "UT", label: "Utah" },
	{ key: "VT", label: "Vermont" },
	{ key: "VA", label: "Virginia" },
	{ key: "WA", label: "Washington" },
	{ key: "WV", label: "West Virginia" },
	{ key: "WI", label: "Wisconsin" },
	{ key: "WY", label: "Wyoming" },
]

export const DEGREE_OPTIONS = [
	{ key: "high_school", label: "GED or high school diploma", labelKey: "staff.options.degrees.highSchool" },
	{ key: "associate", label: "Associate degree", labelKey: "staff.options.degrees.associate" },
	{ key: "bachelor", label: "Bachelor's degree", labelKey: "staff.options.degrees.bachelor" },
	{ key: "master", label: "Master's degree", labelKey: "staff.options.degrees.master" },
	{ key: "phd", label: "PhD, EdD or other doctorate degree", labelKey: "staff.options.degrees.phd" },
	{ key: "other", label: "Other", labelKey: "staff.options.degrees.other" },
]

export const SIGNUP_STATUS_OPTIONS = [
	{ key: "active", label: "Active", labelKey: "staff.options.signupStatuses.active" },
	{ key: "pending", label: "Pending", labelKey: "staff.options.signupStatuses.pending" },
	{ key: "invited", label: "Invited", labelKey: "staff.options.signupStatuses.invited" },
	{ key: "inactive", label: "Inactive", labelKey: "staff.options.signupStatuses.inactive" },
]

export const PERMISSION_OPTIONS = [
	{ key: "view_students", label: "View students", labelKey: "staff.options.permissions.viewStudents" },
	{ key: "edit_students", label: "Edit students", labelKey: "staff.options.permissions.editStudents" },
	{ key: "view_staff", label: "View staff", labelKey: "staff.options.permissions.viewStaff" },
	{ key: "edit_staff", label: "Edit staff", labelKey: "staff.options.permissions.editStaff" },
	{ key: "manage_rooms", label: "Manage rooms", labelKey: "staff.options.permissions.manageRooms" },
	{ key: "view_reports", label: "View reports", labelKey: "staff.options.permissions.viewReports" },
	{ key: "manage_billing", label: "Manage billing", labelKey: "staff.options.permissions.manageBilling" },
	{ key: "admin_settings", label: "Admin settings", labelKey: "staff.options.permissions.adminSettings" },
]

export const RELATIONSHIP_OPTIONS = [
	{ key: "dad", label: "Dad", labelKey: "staff.options.relationships.dad" },
	{ key: "mom", label: "Mom", labelKey: "staff.options.relationships.mom" },
	{ key: "spouse", label: "Spouse", labelKey: "staff.options.relationships.spouse" },
	{ key: "sibling", label: "Sibling", labelKey: "staff.options.relationships.sibling" },
	{ key: "friend", label: "Friend", labelKey: "staff.options.relationships.friend" },
	{ key: "other", label: "Other", labelKey: "staff.options.relationships.other" },
]

export const WORKING_DAYS = [
	{ key: "mon", label: "Mon", labelKey: "staff.options.workingDays.mon" },
	{ key: "tue", label: "Tue", labelKey: "staff.options.workingDays.tue" },
	{ key: "wed", label: "Wed", labelKey: "staff.options.workingDays.wed" },
	{ key: "thu", label: "Thu", labelKey: "staff.options.workingDays.thu" },
	{ key: "fri", label: "Fri", labelKey: "staff.options.workingDays.fri" },
	{ key: "sat", label: "Sat", labelKey: "staff.options.workingDays.sat" },
	{ key: "sun", label: "Sun", labelKey: "staff.options.workingDays.sun" },
] as const

export type DayKey = (typeof WORKING_DAYS)[number]["key"]

export const DEFAULT_SCHEDULE: Record<DayKey, boolean> = {
	mon: false,
	tue: false,
	wed: false,
	thu: false,
	fri: false,
	sat: false,
	sun: false,
}

// Mock rooms for development - will be replaced with API data
export const MOCK_ROOMS = [
	{ key: "room-1", label: "Baby turtles", avatar: "" },
	{ key: "room-2", label: "Little stars", avatar: "" },
	{ key: "room-3", label: "Rainbow room", avatar: "" },
	{ key: "room-4", label: "Sunshine class", avatar: "" },
]

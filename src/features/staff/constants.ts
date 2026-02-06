export const STAFF_ROLES = [
	{ key: "manager", label: "Manager", description: "Full administrative access" },
	{ key: "teacher", label: "Teacher", description: "Classroom management and student care" },
	{ key: "assistant", label: "Assistant", description: "Support role for teachers" },
	{ key: "admin", label: "Admin", description: "Administrative tasks and records" },
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
	{ key: "high_school", label: "High School Diploma" },
	{ key: "associate", label: "Associate's Degree" },
	{ key: "bachelor", label: "Bachelor's Degree" },
	{ key: "master", label: "Master's Degree" },
	{ key: "phd", label: "Ph.D. Degree" },
	{ key: "other", label: "Other" },
]

export const PERMISSION_OPTIONS = [
	{ key: "view_students", label: "View students" },
	{ key: "edit_students", label: "Edit students" },
	{ key: "view_staff", label: "View staff" },
	{ key: "edit_staff", label: "Edit staff" },
	{ key: "manage_rooms", label: "Manage rooms" },
	{ key: "view_reports", label: "View reports" },
	{ key: "manage_billing", label: "Manage billing" },
	{ key: "admin_settings", label: "Admin settings" },
]

export const RELATIONSHIP_OPTIONS = [
	{ key: "dad", label: "Dad" },
	{ key: "mom", label: "Mom" },
	{ key: "spouse", label: "Spouse" },
	{ key: "sibling", label: "Sibling" },
	{ key: "friend", label: "Friend" },
	{ key: "other", label: "Other" },
]

export const WORKING_DAYS = [
	{ key: "mon", label: "Mon" },
	{ key: "tue", label: "Tue" },
	{ key: "wed", label: "Wed" },
	{ key: "thu", label: "Thu" },
	{ key: "fri", label: "Fri" },
	{ key: "sat", label: "Sat" },
	{ key: "sun", label: "Sun" },
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

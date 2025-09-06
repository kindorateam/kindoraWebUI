import type { Staff } from '@/types/staff'

const MOCK_STAFF_DATA: Staff[] = [
  {
    id: '1',
    name: 'Sophia Carter',
    role: 'Admin',
    email: 's.carter@exampled.com',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
    pin: '4423',
    rooms: ['Baby turtles'],
    isCurrentUser: true,
  },
  {
    id: '2',
    name: 'James Carter',
    role: 'Manager',
    email: 'm.carter@exampled.com',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    pin: '8921',
    rooms: ['Baby turtles'],
  },
  {
    id: '3',
    name: 'Mia Caldwell',
    role: 'Staff',
    email: 'm.caldwell@exampled.com',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    pin: '3456',
    rooms: ['Baby turtles'],
  },
  {
    id: '4',
    name: 'Olivia Hayes',
    role: 'Staff',
    email: 'o.hayes@exampled.com',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    pin: '7890',
    rooms: ['Baby turtles'],
  },
  {
    id: '5',
    name: 'Sophie Bennett',
    role: 'Staff',
    email: 's.bennett@exampled.com',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    pin: '1234',
    rooms: ['Baby turtles'],
  },
]

export const getStaffMembers = async (): Promise<Staff[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_STAFF_DATA
}

export const updateStaffPin = async (
  staffId: string,
  newPin: string,
): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  const staff = MOCK_STAFF_DATA.find((s) => s.id === staffId)
  if (staff) {
    staff.pin = newPin
  }
}

export default {
  getStaffMembers,
  updateStaffPin,
}

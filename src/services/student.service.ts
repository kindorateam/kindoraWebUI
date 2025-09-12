import type { Student } from '@/types/student'

const MOCK_STUDENTS_DATA: Student[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    dob: '2019-03-14',
    parents: [
      {
        id: 'p1',
        name: 'Sarah Johnson',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
        email: 'sarah.johnson@example.com',
        phone: '+1 (555) 100-1001',
        pin: '3281',
      },
      {
        id: 'p2',
        name: 'Michael Johnson',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        email: 'michael.johnson@example.com',
        phone: '+1 (555) 100-1002',
        pin: '5524',
      },
    ],
    guardian: {
      name: 'Emily Johnson',
      phone: '+1 (555) 100-1003',
      pin: '9134',
    },
    medical: {
      allergies: ['Peanuts'],
      doctor: { name: 'Dr. Alice Smith', phone: '+1 (555) 200-1100' },
    },
    rooms: [{ id: 'r1', name: 'Baby Turtles', icon: 'turtle' }],
    tags: [
      {
        id: 't1',
        name: 'Star Student',
        color: 'bg-yellow-100 text-yellow-800',
      },
      { id: 't2', name: 'Art Club', color: 'bg-blue-100 text-blue-800' },
    ],
    status: 'Active',
  },
  {
    id: '2',
    name: 'Liam Chen',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    dob: '2018-11-02',
    parents: [
      {
        id: 'p3',
        name: 'Lisa Chen',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        email: 'lisa.chen@example.com',
        phone: '+1 (555) 101-2001',
        pin: '7412',
      },
    ],
    guardian: {
      name: 'Wei Chen',
      phone: '+1 (555) 101-2002',
      pin: '6628',
    },
    medical: {
      allergies: [],
      doctor: { name: 'Dr. Ben Carter', phone: '+1 (555) 200-1101' },
    },
    rooms: [{ id: 'r2', name: 'Happy Rabbits', icon: 'rabbit' }],
    tags: [
      { id: 't3', name: 'Sports Team', color: 'bg-green-100 text-green-800' },
    ],
    status: 'Active',
  },
  {
    id: '3',
    name: 'Ava Rodriguez',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    dob: '2019-07-21',
    parents: [
      {
        id: 'p4',
        name: 'Maria Rodriguez',
        relationship: 'Guardian',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        email: 'maria.rodriguez@example.com',
        phone: '+1 (555) 102-3001',
        pin: '8459',
      },
    ],
    guardian: {
      name: 'Maria Rodriguez',
      phone: '+1 (555) 102-3001',
      pin: '8459',
    },
    medical: {
      allergies: ['Strawberries'],
      doctor: { name: 'Dr. Clara Gomez', phone: '+1 (555) 200-1102' },
    },
    rooms: [{ id: 'r3', name: 'Curious Bears', icon: 'bear' }],
    tags: [
      { id: 't4', name: 'Music Club', color: 'bg-purple-100 text-purple-800' },
      { id: 't5', name: 'Science Fair', color: 'bg-red-100 text-red-800' },
    ],
    status: 'Active',
  },
  {
    id: '4',
    name: 'Noah Kim',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    dob: '2018-05-09',
    parents: [
      {
        id: 'p5',
        name: 'Jennifer Kim',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        email: 'jennifer.kim@example.com',
        phone: '+1 (555) 103-4001',
        pin: '1907',
      },
      {
        id: 'p6',
        name: 'David Kim',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        email: 'david.kim@example.com',
        phone: '+1 (555) 103-4002',
        pin: '2044',
      },
    ],
    guardian: {
      name: 'Grace Kim',
      phone: '+1 (555) 103-4003',
      pin: '7711',
    },
    medical: {
      allergies: [],
      doctor: { name: 'Dr. Henry Park', phone: '+1 (555) 200-1103' },
    },
    rooms: [{ id: 'r4', name: 'Bright Butterflies', icon: 'butterfly' }],
    tags: [
      { id: 't6', name: 'Debate Club', color: 'bg-indigo-100 text-indigo-800' },
    ],
    status: 'Active',
  },
  {
    id: '5',
    name: 'Isabella Patel',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    dob: '2019-01-30',
    parents: [
      {
        id: 'p7',
        name: 'Priya Patel',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
        email: 'priya.patel@example.com',
        phone: '+1 (555) 104-5001',
        pin: '5566',
      },
    ],
    guardian: {
      name: 'Ravi Patel',
      phone: '+1 (555) 104-5002',
      pin: '8810',
    },
    medical: {
      allergies: ['Dairy'],
      doctor: { name: 'Dr. Olivia Chen', phone: '+1 (555) 200-1104' },
    },
    rooms: [{ id: 'r5', name: 'Wise Owls', icon: 'owl' }],
    tags: [
      { id: 't7', name: 'Drama Club', color: 'bg-pink-100 text-pink-800' },
      { id: 't8', name: 'Chess Club', color: 'bg-orange-100 text-orange-800' },
    ],
    status: 'Active',
  },
  {
    id: '6',
    name: 'Mason Thompson',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    dob: '2018-12-18',
    parents: [
      {
        id: 'p8',
        name: 'Rachel Thompson',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        email: 'rachel.thompson@example.com',
        phone: '+1 (555) 105-6001',
        pin: '9942',
      },
      {
        id: 'p9',
        name: 'James Thompson',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        email: 'james.thompson@example.com',
        phone: '+1 (555) 105-6002',
        pin: '3159',
      },
    ],
    guardian: {
      name: 'Evelyn Thompson',
      phone: '+1 (555) 105-6003',
      pin: '4507',
    },
    medical: {
      allergies: ['Eggs'],
      doctor: { name: 'Dr. Noah Brooks', phone: '+1 (555) 200-1105' },
    },
    rooms: [{ id: 'r6', name: 'Clever Foxes', icon: 'fox' }],
    tags: [
      { id: 't9', name: 'Math Olympiad', color: 'bg-blue-100 text-blue-800' },
    ],
    status: 'Active',
  },
  {
    id: '7',
    name: 'Sophia Garcia',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    dob: '2019-06-07',
    parents: [
      {
        id: 'p10',
        name: 'Ana Garcia',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        email: 'ana.garcia@example.com',
        phone: '+1 (555) 106-7001',
        pin: '7781',
      },
    ],
    guardian: {
      name: 'Carlos Garcia',
      phone: '+1 (555) 106-7002',
      pin: '1290',
    },
    medical: {
      allergies: [],
      doctor: { name: 'Dr. Ava Turner', phone: '+1 (555) 200-1106' },
    },
    rooms: [{ id: 'r7', name: 'Baby Turtles', icon: 'turtle' }],
    tags: [
      {
        id: 't10',
        name: 'Reading Champion',
        color: 'bg-green-100 text-green-800',
      },
      {
        id: 't11',
        name: 'Nature Club',
        color: 'bg-emerald-100 text-emerald-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '8',
    name: 'Ethan Wilson',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    dob: '2018-09-25',
    parents: [
      {
        id: 'p11',
        name: 'Laura Wilson',
        relationship: 'Guardian',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        email: 'laura.wilson@example.com',
        phone: '+1 (555) 107-8001',
        pin: '6603',
      },
    ],
    guardian: {
      name: 'Laura Wilson',
      phone: '+1 (555) 107-8001',
      pin: '6603',
    },
    medical: {
      allergies: ['Latex'],
      doctor: { name: 'Dr. Liam Hayes', phone: '+1 (555) 200-1107' },
    },
    rooms: [{ id: 'r8', name: 'Happy Rabbits', icon: 'rabbit' }],
    tags: [
      { id: 't12', name: 'Soccer Team', color: 'bg-lime-100 text-lime-800' },
    ],
    status: 'Active',
  },
  {
    id: '9',
    name: 'Olivia Martinez',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    dob: '2019-10-12',
    parents: [
      {
        id: 'p12',
        name: 'Carmen Martinez',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
        email: 'carmen.martinez@example.com',
        phone: '+1 (555) 108-9001',
        pin: '3345',
      },
      {
        id: 'p13',
        name: 'Carlos Martinez',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        email: 'carlos.martinez@example.com',
        phone: '+1 (555) 108-9002',
        pin: '8821',
      },
    ],
    guardian: {
      name: 'Abuela Martinez',
      phone: '+1 (555) 108-9003',
      pin: '4032',
    },
    medical: {
      allergies: ['Shellfish'],
      doctor: { name: 'Dr. Emma Collins', phone: '+1 (555) 200-1108' },
    },
    rooms: [{ id: 'r9', name: 'Curious Bears', icon: 'bear' }],
    tags: [
      {
        id: 't13',
        name: 'Art Exhibition',
        color: 'bg-purple-100 text-purple-800',
      },
      { id: 't14', name: 'Dance Club', color: 'bg-rose-100 text-rose-800' },
    ],
    status: 'Active',
  },
  {
    id: '10',
    name: 'Alexander Lee',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    dob: '2018-02-03',
    parents: [
      {
        id: 'p14',
        name: 'Michelle Lee',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        email: 'michelle.lee@example.com',
        phone: '+1 (555) 109-0001',
        pin: '5590',
      },
    ],
    guardian: {
      name: 'Jason Lee',
      phone: '+1 (555) 109-0002',
      pin: '7704',
    },
    medical: {
      allergies: [],
      doctor: { name: 'Dr. Lucas Reed', phone: '+1 (555) 200-1109' },
    },
    rooms: [{ id: 'r10', name: 'Bright Butterflies', icon: 'butterfly' }],
    tags: [
      {
        id: 't15',
        name: 'Science Project',
        color: 'bg-cyan-100 text-cyan-800',
      },
    ],
    status: 'Active',
  },
]

export const getStudents = async (): Promise<Student[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1))
  return MOCK_STUDENTS_DATA
}

export const getStudentById = async (
  studentId: string,
): Promise<Student | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1))
  return MOCK_STUDENTS_DATA.find((student) => student.id === studentId) ?? null
}

export default {
  getStudents,
  getStudentById,
}

import type Student from '@/types/student'

const MOCK_STUDENTS_DATA: Student[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p1',
        name: 'Sarah Johnson',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'p2',
        name: 'Michael Johnson',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r1',
        name: 'Baby Turtles',
        icon: 'turtle',
      },
    ],
    tags: [
      {
        id: 't1',
        name: 'Star Student',
        color: 'bg-yellow-100 text-yellow-800',
      },
      {
        id: 't2',
        name: 'Art Club',
        color: 'bg-blue-100 text-blue-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '2',
    name: 'Liam Chen',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p3',
        name: 'Lisa Chen',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r2',
        name: 'Happy Rabbits',
        icon: 'rabbit',
      },
    ],
    tags: [
      {
        id: 't3',
        name: 'Sports Team',
        color: 'bg-green-100 text-green-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '3',
    name: 'Ava Rodriguez',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p4',
        name: 'Maria Rodriguez',
        relationship: 'Guardian',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r3',
        name: 'Curious Bears',
        icon: 'bear',
      },
    ],
    tags: [
      {
        id: 't4',
        name: 'Music Club',
        color: 'bg-purple-100 text-purple-800',
      },
      {
        id: 't5',
        name: 'Science Fair',
        color: 'bg-red-100 text-red-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '4',
    name: 'Noah Kim',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p5',
        name: 'Jennifer Kim',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'p6',
        name: 'David Kim',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r4',
        name: 'Bright Butterflies',
        icon: 'butterfly',
      },
    ],
    tags: [
      {
        id: 't6',
        name: 'Debate Club',
        color: 'bg-indigo-100 text-indigo-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '5',
    name: 'Isabella Patel',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p7',
        name: 'Priya Patel',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r5',
        name: 'Wise Owls',
        icon: 'owl',
      },
    ],
    tags: [
      {
        id: 't7',
        name: 'Drama Club',
        color: 'bg-pink-100 text-pink-800',
      },
      {
        id: 't8',
        name: 'Chess Club',
        color: 'bg-orange-100 text-orange-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '6',
    name: 'Mason Thompson',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p8',
        name: 'Rachel Thompson',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'p9',
        name: 'James Thompson',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r6',
        name: 'Clever Foxes',
        icon: 'fox',
      },
    ],
    tags: [
      {
        id: 't9',
        name: 'Math Olympiad',
        color: 'bg-blue-100 text-blue-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '7',
    name: 'Sophia Garcia',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p10',
        name: 'Ana Garcia',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r7',
        name: 'Baby Turtles',
        icon: 'turtle',
      },
    ],
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
    parents: [
      {
        id: 'p11',
        name: 'Laura Wilson',
        relationship: 'Guardian',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r8',
        name: 'Happy Rabbits',
        icon: 'rabbit',
      },
    ],
    tags: [
      {
        id: 't12',
        name: 'Soccer Team',
        color: 'bg-lime-100 text-lime-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '9',
    name: 'Olivia Martinez',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p12',
        name: 'Carmen Martinez',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'p13',
        name: 'Carlos Martinez',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r9',
        name: 'Curious Bears',
        icon: 'bear',
      },
    ],
    tags: [
      {
        id: 't13',
        name: 'Art Exhibition',
        color: 'bg-purple-100 text-purple-800',
      },
      {
        id: 't14',
        name: 'Dance Club',
        color: 'bg-rose-100 text-rose-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '10',
    name: 'Alexander Lee',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p14',
        name: 'Michelle Lee',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r10',
        name: 'Bright Butterflies',
        icon: 'butterfly',
      },
    ],
    tags: [
      {
        id: 't15',
        name: 'Science Project',
        color: 'bg-cyan-100 text-cyan-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '11',
    name: 'Charlotte Brown',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p15',
        name: 'Emily Brown',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'p16',
        name: 'Robert Brown',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r11',
        name: 'Wise Owls',
        icon: 'owl',
      },
    ],
    tags: [
      {
        id: 't16',
        name: 'Writing Contest',
        color: 'bg-amber-100 text-amber-800',
      },
      {
        id: 't17',
        name: 'Photography Club',
        color: 'bg-slate-100 text-slate-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '12',
    name: 'Benjamin Davis',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p17',
        name: 'Jessica Davis',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r12',
        name: 'Clever Foxes',
        icon: 'fox',
      },
    ],
    tags: [
      {
        id: 't18',
        name: 'Robotics Club',
        color: 'bg-gray-100 text-gray-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '13',
    name: 'Amelia Taylor',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p18',
        name: 'Sarah Taylor',
        relationship: 'Guardian',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r13',
        name: 'Baby Turtles',
        icon: 'turtle',
      },
    ],
    tags: [
      {
        id: 't19',
        name: 'Music Festival',
        color: 'bg-violet-100 text-violet-800',
      },
      {
        id: 't20',
        name: 'Environmental Club',
        color: 'bg-teal-100 text-teal-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '14',
    name: 'Lucas Anderson',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p19',
        name: 'Megan Anderson',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'p20',
        name: 'Mark Anderson',
        relationship: 'Father',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r14',
        name: 'Happy Rabbits',
        icon: 'rabbit',
      },
    ],
    tags: [
      {
        id: 't21',
        name: 'Basketball Team',
        color: 'bg-orange-100 text-orange-800',
      },
    ],
    status: 'Active',
  },
  {
    id: '15',
    name: 'Harper White',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    parents: [
      {
        id: 'p21',
        name: 'Amanda White',
        relationship: 'Mother',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    ],
    rooms: [
      {
        id: 'r15',
        name: 'Curious Bears',
        icon: 'bear',
      },
    ],
    tags: [
      {
        id: 't22',
        name: 'Poetry Slam',
        color: 'bg-fuchsia-100 text-fuchsia-800',
      },
      {
        id: 't23',
        name: 'Cooking Club',
        color: 'bg-yellow-100 text-yellow-800',
      },
    ],
    status: 'Active',
  },
]

export const getStudents = async (): Promise<Student[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_STUDENTS_DATA
}

export default {
  getStudents,
}

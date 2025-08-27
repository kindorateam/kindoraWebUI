import type Room from '@/types/room'

const MOCK_ROOMS_DATA: Room[] = [
  {
    id: '1',
    name: 'Baby Turtles',
    icon: 'turtle',
    capacity: 20,
    studentsCount: 15,
    staffCount: 3,
    signedInStudents: [
      {
        id: 's1',
        name: 'Emma Johnson',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's2',
        name: 'Liam Williams',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's3',
        name: 'Olivia Brown',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's4',
        name: 'Noah Davis',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's5',
        name: 'Ava Miller',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
    ],
    signedInStaff: [
      {
        id: 'st1',
        name: 'Sophia Carter',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'st2',
        name: 'James Carter',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'st3',
        name: 'Mia Caldwell',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    ],
  },
  {
    id: '2',
    name: 'Happy Rabbits',
    icon: 'rabbit',
    capacity: 18,
    studentsCount: 12,
    staffCount: 2,
    signedInStudents: [
      {
        id: 's6',
        name: 'William Garcia',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's7',
        name: 'Isabella Martinez',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's8',
        name: 'James Rodriguez',
        avatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
      },
    ],
    signedInStaff: [
      {
        id: 'st4',
        name: 'Olivia Hayes',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'st5',
        name: 'Sophie Bennett',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
    ],
  },
  {
    id: '3',
    name: 'Curious Bears',
    icon: 'bear',
    capacity: 22,
    studentsCount: 18,
    staffCount: 3,
    signedInStudents: [
      {
        id: 's9',
        name: 'Charlotte Lee',
        avatar:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's10',
        name: 'Amelia Walker',
        avatar:
          'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face',
      },
    ],
    signedInStaff: [
      {
        id: 'st6',
        name: 'Michael Chen',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
    ],
  },
  {
    id: '4',
    name: 'Bright Butterflies',
    icon: 'butterfly',
    capacity: 16,
    studentsCount: 14,
    staffCount: 2,
    signedInStudents: [
      {
        id: 's11',
        name: 'Lucas Hall',
        avatar:
          'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's12',
        name: 'Harper Allen',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's13',
        name: 'Ethan Young',
        avatar:
          'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's14',
        name: 'Evelyn King',
        avatar:
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's15',
        name: 'Alexander Wright',
        avatar:
          'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's16',
        name: 'Mila Scott',
        avatar:
          'https://images.unsplash.com/photo-1502767089025-6572583495f9?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 's17',
        name: 'Daniel Green',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      },
    ],
    signedInStaff: [
      {
        id: 'st7',
        name: 'Emma Wilson',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'st8',
        name: 'David Taylor',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
    ],
  },
  {
    id: '5',
    name: 'Wise Owls',
    icon: 'owl',
    capacity: 25,
    studentsCount: 20,
    staffCount: 4,
    signedInStudents: [],
    signedInStaff: [],
  },
  {
    id: '6',
    name: 'Clever Foxes',
    icon: 'fox',
    capacity: 15,
    studentsCount: 10,
    staffCount: 2,
    signedInStudents: [
      {
        id: 's18',
        name: 'Grace Adams',
        avatar:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      },
    ],
    signedInStaff: [
      {
        id: 'st9',
        name: 'Sarah Thompson',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'st10',
        name: 'Robert Johnson',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'st11',
        name: 'Jessica Davis',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=150&h=150&fit=crop&crop=face',
      },
    ],
  },
]

export const getRooms = async (): Promise<Room[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_ROOMS_DATA
}

export const getRoomById = async (id: string): Promise<Room | undefined> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_ROOMS_DATA.find((room) => room.id === id)
}

export default {
  getRooms,
  getRoomById,
}

import type { Student, Room, Parent, StudentGroup } from '@/types'

export const mockRooms: Room[] = [
  {
    id: 'baby-turtles',
    name: 'Baby turtles',
    emoji: '🐢',
    color: '#40c4aa',
  },
  {
    id: 'baby-giraffe',
    name: 'Baby giraffe',
    emoji: '🦒',
    color: '#f4a462',
  },
  {
    id: 'elephants',
    name: 'Elephants',
    emoji: '🐘',
    color: '#8b9dc3',
  },
  {
    id: 'little-zebras',
    name: 'Little zebras',
    emoji: '🦓',
    color: '#dda0dd',
  },
  {
    id: 'big-mammoth',
    name: 'Big mammoth',
    emoji: '🦣',
    color: '#cd853f',
  },
]

export const mockParents: Parent[] = [
  {
    id: 'parent-1',
    firstName: 'John',
    lastName: 'Whitaker',
    avatar:
      'http://localhost:3845/assets/7c5fc8018c78ff7a1b3bd084c464ad50b118a42b.svg',
  },
  {
    id: 'parent-2',
    firstName: 'Sarah',
    lastName: 'Carter',
    avatar:
      'http://localhost:3845/assets/c2407a18d2f675ca27599f512d08e51b3c07c745.svg',
  },
  {
    id: 'parent-3',
    firstName: 'Michael',
    lastName: 'Hayes',
    avatar:
      'http://localhost:3845/assets/66e76a2b7c62ac1fe302d4ac603a78229eddadbf.svg',
  },
  {
    id: 'parent-4',
    firstName: 'Lisa',
    lastName: 'Brooks',
    avatar:
      'http://localhost:3845/assets/6c905cc11c20bf49dfe0fe77b87d4293ec01fd6d.svg',
  },
  {
    id: 'parent-5',
    firstName: 'David',
    lastName: 'Anderson',
    avatar:
      'http://localhost:3845/assets/fccef6ae7a57ad09e0fc282699deeef989fbafb9.svg',
  },
]

export const mockStudents: Student[] = [
  // Baby turtles
  {
    id: 'student-1',
    firstName: 'James',
    lastName: 'Whitaker',
    avatar:
      'http://localhost:3845/assets/bb0dd058aa85df5052f1645fad81fd7742f05668.png',
    room: mockRooms[0]!,
    parents: [mockParents[0]!],
    tags: [{ id: 'tag-1', label: 'Fast learner' }],
    status: 'active',
  },
  {
    id: 'student-2',
    firstName: 'Emily',
    lastName: 'Carter',
    avatar:
      'http://localhost:3845/assets/e2d85eb584c0162414fbf87d13feea9a7001864f.png',
    room: mockRooms[0]!,
    parents: [mockParents[1]!, mockParents[4]!],
    tags: [
      { id: 'tag-2', label: 'Good memory' },
      { id: 'tag-3', label: 'Loves drawing' },
    ],
    status: 'vacation',
  },
  {
    id: 'student-3',
    firstName: 'Mia',
    lastName: 'Caldwell',
    avatar:
      'http://localhost:3845/assets/f4dfae43f577d6fd010acc0c28a431a4581f79ce.png',
    room: mockRooms[0]!,
    parents: [mockParents[2]!],
    tags: [
      { id: 'tag-1', label: 'Fast learner' },
      { id: 'tag-3', label: 'Loves drawing' },
    ],
    status: 'active',
  },
  {
    id: 'student-4',
    firstName: 'Olivia',
    lastName: 'Hayes',
    avatar:
      'http://localhost:3845/assets/5d49c9f22e4118e35bfd5dbc70af92d3115deced.png',
    room: mockRooms[0]!,
    parents: [mockParents[2]!, mockParents[4]!],
    tags: [
      { id: 'tag-1', label: 'Fast learner' },
      { id: 'tag-2', label: 'Good memory' },
    ],
    status: 'active',
  },
  {
    id: 'student-5',
    firstName: 'Sophie',
    lastName: 'Bennett',
    avatar:
      'http://localhost:3845/assets/f14bb25b840e1bca8285f9d3da55bcc543e7c3c7.png',
    room: mockRooms[0]!,
    parents: [mockParents[0]!, mockParents[3]!],
    tags: [
      { id: 'tag-2', label: 'Good memory' },
      { id: 'tag-3', label: 'Loves drawing' },
    ],
    status: 'active',
  },
  // Baby giraffe
  {
    id: 'student-6',
    firstName: 'Daniel',
    lastName: 'Brooks',
    avatar:
      'http://localhost:3845/assets/e2d85eb584c0162414fbf87d13feea9a7001864f.png',
    room: mockRooms[1]!,
    parents: [mockParents[3]!],
    tags: [
      { id: 'tag-1', label: 'Fast learner' },
      { id: 'tag-3', label: 'Loves drawing' },
    ],
    status: 'sick',
  },
  {
    id: 'student-7',
    firstName: 'James',
    lastName: 'Whitaker',
    avatar:
      'http://localhost:3845/assets/513423e61783931890a1d28de501534b82059cb4.png',
    room: mockRooms[1]!,
    parents: [mockParents[0]!, mockParents[1]!],
    tags: [{ id: 'tag-1', label: 'Fast learner' }],
    status: 'active',
  },
  {
    id: 'student-8',
    firstName: 'Chloe',
    lastName: 'Anderson',
    avatar:
      'http://localhost:3845/assets/059a1e1439aace736da70dad5ac325539ee7d376.png',
    room: mockRooms[1]!,
    parents: [mockParents[4]!],
    tags: [
      { id: 'tag-1', label: 'Fast learner' },
      { id: 'tag-3', label: 'Loves drawing' },
    ],
    status: 'active',
  },
  {
    id: 'student-9',
    firstName: 'Sophie',
    lastName: 'Bennett',
    avatar:
      'http://localhost:3845/assets/e8302cbc763d187bff42d5010c998c0a4da76461.png',
    room: mockRooms[1]!,
    parents: [mockParents[0]!, mockParents[2]!],
    tags: [
      { id: 'tag-2', label: 'Good memory' },
      { id: 'tag-3', label: 'Loves drawing' },
    ],
    status: 'active',
  },
]

export const mockStudentGroups: StudentGroup[] = [
  {
    room: mockRooms[0]!,
    students: mockStudents.filter((s) => s.room.id === 'baby-turtles'),
    isExpanded: true,
  },
  {
    room: mockRooms[1]!,
    students: mockStudents.filter((s) => s.room.id === 'baby-giraffe'),
    isExpanded: true,
  },
  {
    room: mockRooms[2]!,
    students: [],
    isExpanded: false,
  },
  {
    room: mockRooms[3]!,
    students: [],
    isExpanded: false,
  },
  {
    room: mockRooms[4]!,
    students: [],
    isExpanded: false,
  },
]

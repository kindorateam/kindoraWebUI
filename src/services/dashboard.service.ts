import type { DashboardData } from '@/types/dashboard.types'

const fetchDashboardData = (): DashboardData => {
  // Mock data for now - replace with actual API call
  return {
    stats: {
      signedIn: {
        total: 48,
        morning: 74,
        afternoon: 16,
        today: 24,
      },
      absentees: {
        count: 5,
        children: [
          { id: '1', name: 'John', avatar: undefined },
          { id: '2', name: 'Emma', avatar: undefined },
        ],
      },
      counts: {
        students: 74,
        rooms: 5,
        staff: 24,
      },
    },
    roomsStatus: [
      {
        id: '1',
        name: 'Baby turtles',
        students: [
          { id: '1', name: 'Alice', avatar: undefined },
          { id: '2', name: 'Bob', avatar: undefined },
        ],
        staffSigned: 5,
        expectedStaff: 5,
        ratio: '1:5',
      },
      {
        id: '2',
        name: 'Elephants',
        students: [
          { id: '3', name: 'Charlie', avatar: undefined },
          { id: '4', name: 'Diana', avatar: undefined },
        ],
        staffSigned: 10,
        expectedStaff: 10,
        ratio: '1:6',
      },
      {
        id: '3',
        name: 'Little zebras',
        students: [
          { id: '5', name: 'Eve', avatar: undefined },
          { id: '6', name: 'Frank', avatar: undefined },
        ],
        staffSigned: 10,
        expectedStaff: 10,
        ratio: '1:8',
      },
      {
        id: '4',
        name: 'Baby giraffe',
        students: [{ id: '7', name: 'Grace', avatar: undefined }],
        staffSigned: 8,
        expectedStaff: 8,
        ratio: '1:7',
      },
      {
        id: '5',
        name: 'Big mammoth',
        students: [
          { id: '8', name: 'Henry', avatar: undefined },
          { id: '9', name: 'Iris', avatar: undefined },
        ],
        staffSigned: 10,
        expectedStaff: 10,
        ratio: '1:9',
      },
    ],
    upcomingEvents: [
      {
        id: '1',
        date: 'FRI',
        day: 'Friday',
        dayNum: 24,
        title: 'Artist visitor',
        time: '10am-12pm',
        type: 'artist-visitor',
      },
      {
        id: '2',
        date: 'MON',
        day: 'Monday',
        dayNum: 27,
        title: 'Sophie birthday',
        time: '2pm',
        type: 'birthday',
      },
      {
        id: '3',
        date: 'TUE',
        day: 'Tuesday',
        dayNum: 28,
        title: 'Petting zoo visit',
        time: '9am-1pm',
        type: 'zoo-visit',
      },
    ],
    needsAttention: [
      {
        id: '1',
        name: 'James Whitaker',
        status: 'Unexplained absence',
        type: 'absence',
      },
      {
        id: '2',
        name: 'Emily Carter',
        status: 'Profile incomplete',
        type: 'incomplete',
      },
      {
        id: '3',
        name: 'Mia Caldwell',
        status: 'Incident',
        type: 'incident',
      },
    ],
    payments: {
      received: 11740.0,
      outstanding: 7740.0,
    },
    loggedActivities: {
      categories: [
        { id: '1', name: 'Photo', type: 'photo', count: 4, color: '#EC4899' },
        { id: '2', name: 'Video', type: 'video', count: 7, color: '#3B82F6' },
        { id: '3', name: 'Food', type: 'food', count: 12, color: '#F59E0B' },
        {
          id: '4',
          name: 'Bathroom',
          type: 'bathroom',
          count: 5,
          color: '#10B981',
        },
      ],
      details: [
        { id: '1', name: 'Elephants', count: 4 },
        { id: '2', name: 'Little zebras', count: 5 },
        { id: '3', name: 'Baby giraffe', count: 16 },
        { id: '4', name: 'Big mammoth', count: 8 },
      ],
    },
  }
}

export default fetchDashboardData

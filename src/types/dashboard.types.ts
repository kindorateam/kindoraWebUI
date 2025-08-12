export interface DashboardStats {
  signedIn: {
    total: number
    morning: number
    afternoon: number
    today: number
  }
  absentees: {
    count: number
    children: {
      id: string
      name: string
      avatar?: string
    }[]
  }
  counts: {
    students: number
    rooms: number
    staff: number
  }
}

export interface RoomStatus {
  id: string
  name: string
  students: {
    id: string
    name: string
    avatar?: string
  }[]
  staffSigned: number
  expectedStaff: number
  ratio: string
}

export interface CalendarEvent {
  id: string
  date: string
  day: string
  dayNum: number
  title: string
  time: string
  type: 'artist-visitor' | 'birthday' | 'zoo-visit'
}

export interface NeedsAttentionItem {
  id: string
  name: string
  avatar?: string
  status: string
  type: 'absence' | 'incomplete' | 'incident'
}

export interface PaymentInfo {
  received: number
  outstanding: number
}

export interface LoggedActivity {
  id: string
  name: string
  type: 'photo' | 'video' | 'food' | 'bathroom'
  count: number
  color: string
}

export interface DashboardData {
  stats: DashboardStats
  roomsStatus: RoomStatus[]
  upcomingEvents: CalendarEvent[]
  needsAttention: NeedsAttentionItem[]
  payments: PaymentInfo
  loggedActivities: {
    categories: LoggedActivity[]
    details: {
      id: string
      name: string
      count: number
    }[]
  }
}

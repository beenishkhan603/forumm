import { useQuery } from '@apollo/client'
import { GET_EVENT_BY_ID } from '@graphql/events/GetEventById'
import { GET_MY_EVENTS } from '@graphql/events/getMyEvents'
import { GET_ALL_USERS } from '@graphql/users/getAllUsers'
import { EventAttendee, User } from '@graphql/__generated/graphql'
import moment from 'moment'
import { useAuth } from './useAuth'
import { useRouter } from 'next/router'
import { GET_USERS_IN_GROUP } from '@graphql/users/getUsersInGroup'
import { GET_ALL_EVENTS } from '@graphql/events/getAllEvents'

export const useDashboard = () => {
  const { profile } = useAuth()
  const isAdmin = profile?.groups?.includes('forumm-admin')

  const { loading: usersLoading, data: usersData } = useQuery(GET_ALL_USERS)

  const GetEventData = () => {
    const { loading: myEventsLoading, data: myEventsData } = useQuery(
      GET_MY_EVENTS,
      { skip: isAdmin }
    )
    const { loading: allEventsLoading, data: allEventsData } = useQuery(
      GET_ALL_EVENTS,
      { skip: !isAdmin }
    )
    if (isAdmin)
      return { data: allEventsData?.getAllEvents, loading: allEventsLoading }
    return { data: myEventsData?.getMyEvents, loading: myEventsLoading }
  }

  const { data: eventsData, loading: eventsLoading } = GetEventData()

  const { query } = useRouter()
  const { data, loading } = useQuery(GET_EVENT_BY_ID, {
    variables: { input: { eventId: query.eventId as string } },
    skip: !query.eventId,
  })
  const { data: organizersData, loading: organizersLoading } = useQuery(
    GET_USERS_IN_GROUP,
    {
      variables: { input: { groupName: 'organizer' } },
      skip: !isAdmin,
    }
  )

  const organizers = organizersData?.getUsersInGroup.items.filter(
    (o: User) => o.company || o.university
  )
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const events = eventsData?.filter((e) => {
    if (isAdmin) return true
    return e.organizerId === profile?.userId
  })
  const event = data?.getEventById
  const eventsByYear = events?.filter(
    (e) => new Date(e.dateCreated).getFullYear() === currentYear
  )
  const eventsByMonth = events?.filter(
    (e) => new Date(e.dateCreated).getMonth() === currentMonth
  )
  const eventsByPreviousYear = events?.filter(
    (e) => new Date(e.dateCreated).getFullYear() === currentYear - 1
  )
  const eventsByPreviousMonth = events?.filter(
    (e) => new Date(e.dateCreated).getMonth() === currentMonth - 1
  )
  const users = usersData?.getAllUsers.items.filter((u) => {
    return u.company === (profile?.company ?? profile?.university)
  })

  const usersByYear = users?.filter(
    (u) => new Date(u.dateCreated).getFullYear() === currentYear
  )
  const usersByMonth = users?.filter(
    (u) => new Date(u.dateCreated).getMonth() === currentMonth
  )

  const attendees = events?.flatMap((e) => e.attendees)

  const attendee = event?.attendees
  const attendeesByYear = eventsByYear?.flatMap((e) => e.attendees)
  const attendeesByMonth = eventsByMonth?.flatMap((e) => e.attendees)

  function filterByEmail(
    attendees: EventAttendee[] | undefined,
    users: User[]
  ): EventAttendee[] | undefined {
    return attendees?.filter((a) => users?.some((u) => u.email === a?.email))
  }

  const registeredUsers = filterByEmail(
    attendees as EventAttendee[],
    users as User[]
  )
  const registeredUsersByYear = filterByEmail(
    attendees as EventAttendee[],
    usersByYear as User[]
  )
  const registeredUsersByMonth = filterByEmail(
    attendees as EventAttendee[],
    usersByMonth as User[]
  )

  const allSpeakers = events?.flatMap((e) =>
    e.speakers?.map((s) => ({
      speaker: s,
      title: e.event?.title,
    }))
  )

  const allSpeakersByYear = eventsByYear?.flatMap((e) =>
    e.speakers?.map((s) => ({
      speaker: s,
      title: e.event?.title!,
    }))
  )

  const allSpeakersByMonth = eventsByMonth?.flatMap((e) =>
    e.speakers?.map((s) => ({
      speaker: s,
      title: e.event?.title!,
    }))
  )

  const allBreakoutRooms = events?.flatMap((e) =>
    e.breakoutRooms?.map((b) => ({
      breakoutRoom: b,
      title: e.event?.title!,
    }))
  )
  const allBreakoutRoomsByYear = eventsByYear?.flatMap((e) =>
    e.breakoutRooms?.map((b) => ({
      breakoutRoom: b,
      title: e.event?.title!,
    }))
  )

  const allBreakoutRoomsByMonth = eventsByMonth?.flatMap((e) =>
    e.breakoutRooms?.map((b) => ({
      breakoutRoom: b,
      title: e.event?.title!,
    }))
  )

  const totalUsers = users?.length || 0

  const registeredUsersAllYears = users?.reduce<
    { year: number; users: number }[]
  >((acc, user) => {
    const year = new Date(user.dateCreated).getFullYear()
    const yearData = acc.find((d) => d.year === year)
    if (yearData) {
      yearData.users++
    } else {
      acc.push({ year, users: 1 })
    }
    return acc
  }, [])

  const registeredUsersAllPreviousYears = registeredUsersAllYears?.map(
    (data) => {
      const previousYearData = registeredUsersAllYears.find(
        (d) => d.year === data.year - 1
      )
      return {
        year: data.year,
        users: data.users + (previousYearData ? previousYearData.users : 0),
      }
    }
  )
  const monthUserCreated = users?.filter(
    (user) => new Date(user.dateCreated).getFullYear() === currentYear
  )

  const registeredUsersMonthCurrentYear = Array(12)
    .fill(0)
    .map((_, index) => {
      const month = index + 1
      return {
        month: month,
        users: month === currentMonth + 1 ? totalUsers : null,
      }
    })

  const registeredNewMonthCurrentYear = Array(12)
    .fill(0)
    .map((_, index) => {
      const u = users?.filter(
        (u) => new Date(u.dateCreated).getMonth() === index
      ).length
      return {
        month: index,
        users: monthUserCreated?.filter(
          (u) => new Date(u.dateCreated).getMonth() === index
        ).length,
      }
    })

  const dayUserCreated = users?.filter(
    (user) => new Date(user.dateCreated).getMonth() === new Date().getMonth()
  )
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
  const todaysDate = new Date().getDate()

  let totalUsersAll = users?.length || 0
  const dataWithDaysTotal = Array(daysInMonth)
    .fill(0)
    .map((_, index) => {
      const month = index + 1
      const dayUsers = dayUserCreated?.filter(
        (user) => new Date(user.dateCreated).getDate() === index + 1
      ).length
      totalUsersAll += dayUsers || 0
      return {
        month: month,
        users: month <= todaysDate ? totalUsersAll : null,
      }
    })
  const dataWithDays = Array(daysInMonth)
    .fill(0)
    .map((_, index) => {
      return {
        day: index + 1,
        users: dayUserCreated?.filter(
          (user) => new Date(user.dateCreated).getDate() === index + 1
        ).length,
      }
    })

  const registeredAllLabel = registeredUsersAllYears?.map((year) => {
    return year.year
  })

  const dataAllYears = {
    labels: registeredAllLabel,
    datasets: [
      {
        label: 'Total Users',
        data: registeredUsersAllPreviousYears?.map((year) => {
          return year.users
        }),
        backgroundColor: '#24b3fa',
        barThickness: 20,
        borderRadius: 5,
        inflateAmount: 0.5,
      },
      {
        label: 'New Users',
        data: registeredUsersAllYears?.map((year) => {
          return year.users
        }),
        backgroundColor: '#e91e63',
        barThickness: 20,
        borderRadius: 5,
        inflateAmount: 0.5,
      },
    ],
  }

  const labelsMonthsCurrentYear = registeredNewMonthCurrentYear?.map((m) => {
    return moment().month(m.month).format('MMM')
  })

  const dataMonthsCurrentYear = {
    labels: labelsMonthsCurrentYear,
    datasets: [
      {
        label: 'Total Users',
        data: registeredUsersMonthCurrentYear?.map((month) => {
          return month.users
        }),
        backgroundColor: '#24b3fa',
        barThickness: 20,
        borderRadius: 5,
        inflateAmount: 0.5,
      },
      {
        label: 'New Users',
        data: registeredNewMonthCurrentYear?.map((day) => {
          return day.users
        }),
        backgroundColor: '#e91e63',
        barThickness: 20,
        borderRadius: 5,
        inflateAmount: 0.5,
      },
    ],
  }

  const labelsMonth = dataWithDays?.map((day) => {
    return moment().date(day.day).format('DD MMM')
  })

  const dataMonth = {
    labels: labelsMonth,
    datasets: [
      {
        label: 'Total Users',
        data: dataWithDaysTotal?.map((day) => {
          return day.users
        }),
        backgroundColor: '#24b3fa',
        barThickness: 12,
        borderRadius: 5,
        inflateAmount: 0.5,
      },
      {
        label: 'New Users',
        data: dataWithDays?.map((day) => {
          return day.users
        }),
        backgroundColor: '#e91e63',
        barThickness: 12,
        borderRadius: 5,
        inflateAmount: 0.5,
      },
    ],
  }

  const registeredAttendees = (() => {
    const payload: any = []
    attendee?.forEach((a) => {
      if (a.registered) payload.push(a)
    })
    return payload
  })()

  const attendeeData = {
    labels: ['Invited', 'Registered', 'Active'],
    datasets: [
      {
        data: [attendee?.length, registeredAttendees.length, 0],
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(75, 192, 192)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return {
    organizers,
    event,
    usersData,
    eventsData,
    attendeeData,
    events,
    profile,
    eventsByYear,
    eventsByMonth,
    eventsByPreviousYear,
    eventsByPreviousMonth,
    users,
    usersByYear,
    usersByMonth,
    attendees,
    attendee,
    attendeesByYear,
    attendeesByMonth,
    registeredUsers,
    registeredUsersByYear,
    registeredUsersByMonth,
    usersLoading,
    eventsLoading,
    organizersLoading,
    allSpeakers,
    allSpeakersByYear,
    allSpeakersByMonth,
    allBreakoutRooms,
    allBreakoutRoomsByYear,
    allBreakoutRoomsByMonth,
    dataAllYears,
    dataMonthsCurrentYear,
    dataMonth,
    currentYear,
    isAdmin,
  }
}

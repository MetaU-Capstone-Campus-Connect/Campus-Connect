export function scoreSimilarity(upcomingEvents, pastEvents) {
  const upcomingSet = new Set(upcomingEvents.toLowerCase().split(/\s+/));
  const pastSet = new Set(pastEvents.toLowerCase().split(/\s+/));

  const unionSet = new Set([...upcomingSet, pastSet]);
  const intersecSet = new Set([...upcomingSet].filter((x) => pastSet.has(x)));
  const score = intersecSet.size / unionSet.size;

  return score;
}

export function mapMutuals(user, pastEvents) {
  const mutualsCountMap = new Map();

  for (const event of pastEvents) {
    for (const mutual of event.eventUsers.map((user) => user.userName)) {
      if (mutual !== user) {
        mutualsCountMap.set(mutual, (mutualsCountMap.get(mutual) || 0) + 1);
      }
    }
  }
  return mutualsCountMap;
}

export function mapGroupMutuals(user, allGroupMutuals) {
  const groupMutualsCountMap = new Map();

  for (const group of allGroupMutuals) {
    for (const member of group.members) {
      const groupMemberName = member.user.userName;
      if (groupMemberName !== user) {
        groupMutualsCountMap.set(
          groupMemberName,
          (groupMutualsCountMap.get(groupMemberName) || 0) + 1
        );
      }
    }
  }
  return groupMutualsCountMap;
}

export function scoreGroupMutuals(
  eventUserList,
  groupMutualMap,
  currentUserName
) {
  let score = 0;
  for (const user of eventUserList) {
    if (user !== currentUserName) {
      score += groupMutualMap.get(user) || 0;
    }
  }
  return score / groupMutualMap.size || 0;
}

export function scoreMutuals(eventUserList, mutualsMap, currentUserName) {
  let score = 0;
  if (eventUserList.length === 0) {
    return 0;
  }

  for (const user of eventUserList) {
    if (user !== currentUserName) {
      score += mutualsMap.get(user) || 0;
    }
  }
  return score / mutualsMap.size || 0;
}

export function mapHosts(user, pastEvents) {
  const hostsCountMap = new Map();

  for (const event of pastEvents) {
    const host = event.eventHost;
    if (host !== user) {
      hostsCountMap.set(host, (hostsCountMap.get(host) || 0) + 1);
    }
  }
  return hostsCountMap;
}

export function scoreHosts(eventHost, hostMap, totalPastEvents) {
  if (!eventHost || totalPastEvents.length === 0) {
    return 0;
  }
  const hostTotal = hostMap.get(eventHost) || 0;
  return hostTotal / totalPastEvents || 0;
}

export function mapDays(pastEvents) {
  const daysCountMap = new Map();

  for (const event of pastEvents) {
    const date = new Date(event.eventDate);
    const eventWeekday = date.toLocaleString("en-US", { weekday: "long" });
    daysCountMap.set(eventWeekday, (daysCountMap.get(eventWeekday) || 0) + 1);
  }
  return daysCountMap;
}

export function scoreDays(eventDate, daysCountMap, totalPastEvents) {
  if (!eventDate || totalPastEvents.length === 0) {
    return 0;
  }
  const date = new Date(eventDate);
  const eventWeekday = date.toLocaleString("en-US", { weekday: "long" });
  const totalEventsOnEventWeekday = daysCountMap.get(eventWeekday) || 0;
  return totalEventsOnEventWeekday / totalPastEvents || 0;
}

export function scoreAvailability(event, rsvpEvents) {
  if (!event || rsvpEvents.length === 0) {
    return 0;
  }

  const SECONDS_IN_HOUR = 1000 * 60 * 60;
  const eventStartTime = new Date(event.eventDate).getTime();
  const eventEndTime =
    eventStartTime + (event.eventLength || 1) * SECONDS_IN_HOUR;

  for (const rsvp of rsvpEvents) {
    const rsvpEventStartTime = new Date(rsvp.eventDate).getTime();
    const rsvpEventEndTime =
      rsvpEventStartTime + (rsvp.eventLength || 1) * SECONDS_IN_HOUR;
    const eventIsOverlapping =
      eventStartTime < rsvpEventEndTime && eventEndTime > rsvpEventStartTime;
    if (eventIsOverlapping) {
      return 0.0;
    }
  }

  const gapAfterRSVPEvents = rsvpEvents.map((rsvp) => {
    const rsvpStart = new Date(rsvp.eventDate).getTime();
    const rsvpEnd = rsvpStart + (rsvp.eventLength || 1) * SECONDS_IN_HOUR;
    return Math.abs(eventStartTime - rsvpEnd) / SECONDS_IN_HOUR;
  });

  const minGapAfterRSVPEvent = Math.min(...gapAfterRSVPEvents);

  if (minGapAfterRSVPEvent > 24) return 0.1;
  if (minGapAfterRSVPEvent > 12) return 0.25;
  if (minGapAfterRSVPEvent > 6) return 0.5;
  if (minGapAfterRSVPEvent > 3) return 0.75;
  return 1.0;
}

export function getScoreWeight(totalPastEvents, groupMembersSize) {
  if (totalPastEvents === 0 && groupMembersSize === 0) {
    return {
      title: 0,
      availability: 1,
      users: 0,
      groupMembers: 0,
      location: 0,
      info: 0,
      days: 0,
      hosts: 0,
    };
  }
  if (totalPastEvents === 0) {
    return {
      title: 0,
      availability: 0.5,
      users: 0,
      groupMembers: 0.5,
      location: 0,
      info: 0,
      days: 0,
      hosts: 0,
    };
  }
  return {
    title: 0.25,
    availability: 0.25,
    users: 0.15,
    groupMembers: 0.15,
    location: 0.1,
    info: 0.05,
    days: 0.025,
    hosts: 0.025,
  };
}

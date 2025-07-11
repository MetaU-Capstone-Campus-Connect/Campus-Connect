export function scoreSimilarity(upcomingEvents, pastEvents) {
  const upcomingSet = new Set(upcomingEvents.toLowerCase().split(/\s+/));
  const pastSet = new Set(pastEvents.toLowerCase().split(/\s+/));

  const unionSet = new Set([...upcomingSet, pastSet]);
  const intersecSet = new Set([...upcomingSet].filter((x) => pastSet.has(x)));
  const score = intersecSet.size / unionSet.size;

  return score;
}

export function mapMutuals(user, pastEvents) {
  const map = new Map();

  for (const event of pastEvents) {
    for (const mutual of event.eventUsers.map((user) => user.userName)) {
      if (mutual !== user) {
        map.set(mutual, (map.get(mutual) || 0) + 1);
      }
    }
  }
  return map;
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
  return score / mutualsMap.size;
}

export function mapHosts(user, pastEvents) {
  const map = new Map();

  for (const event of pastEvents) {
    const host = event.eventHost;
    if (host !== user) {
      map.set(host, (map.get(host) || 0) + 1)
    }
  }
  return map;
}

export function scoreHosts(eventHost, hostMap, totalPastEvents) {
  if (!eventHost || totalPastEvents.length === 0) {
    return 0;
  }
  const hostTotal = hostMap.get(eventHost) || 0;
  return hostTotal / totalPastEvents;
}

export function mapDays(pastEvents) {
  const map = new Map();

  for (const event of pastEvents) {
    const date = new Date(event.eventDate);
    const day = date.toLocaleString("en-US", {weekday: "long"})
    map.set(day, (map.get(day) || 0) + 1)
  }
  return map;
}

export function scoreDays(eventDate, mapDays, totalPastEvents) {
  if (!eventDate || totalPastEvents.length === 0) {
    return 0;
  }
  const date = new Date(eventDate);
  const day = date.toLocaleString("en-US", { weekday: "long" });
  const daysTotal = mapDays.get(day) || 0;
  return daysTotal / totalPastEvents;
}
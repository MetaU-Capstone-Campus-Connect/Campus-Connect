export function scoreSimilarity(upcomingEvents, pastEvents) {
  const upcomingSet = new Set(upcomingEvents.toLowerCase().split(/\s+/));
  const pastSet = new Set(pastEvents.toLowerCase().split(/\s+/));

  const unionSet = new Set([...upcomingSet, pastSet]);
  const intersecSet = new Set([...upcomingSet].filter((x) => pastSet.has(x)));
  const score = intersecSet.size / unionSet.size;

  return score;
}
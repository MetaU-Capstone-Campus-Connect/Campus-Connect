# Campus-Connect

A campus events platform built end-to-end as my **Meta University engineering capstone**
(Summer 2025). Students discover events, join groups, RSVP, and see where activity is
clustering on campus.

## What it does

- **Ranked event recommendations.** Each candidate event is scored by an 8-signal weighted
  engine and surfaced in order of relevance.
- **Groups and events.** Create and join groups, create events, RSVP, and track what you're
  attending.
- **Map analytics.** A grid-clustering layer over Google Maps shows where events are dense
  rather than dropping hundreds of overlapping pins.
- **Accounts.** Session-based auth with bcrypt-hashed credentials.

## The recommendation engine

The interesting part. `server/recommendEvents/` scores every event a user hasn't RSVP'd to
across eight signals, then sums them into one weighted total:

| Signal | What it measures |
| --- | --- |
| Title similarity | Text overlap with titles of events the user attended before |
| Description similarity | Same, over event descriptions |
| Location similarity | Same, over event locations |
| Mutual attendees | How many of the user's connections are going |
| Shared-group attendees | Attendees who share a group with the user |
| Host affinity | How often the user has attended this host's events |
| Day-of-week preference | Which days the user actually shows up |
| Calendar availability | Conflicts against events already RSVP'd, a hard filter rather than a penalty |

Weights are not fixed. `getScoreWeight()` adjusts them based on how much history a user has
and how large their groups are, so a new account with no attendance history leans on social
and availability signals instead of text similarity that would be scored against nothing.

## Stack

React (Vite) · Node.js / Express · Prisma · PostgreSQL · Google Maps API

```
client/    React front end
server/
  routes/            auth, events, groups, users, map
  recommendEvents/   scoring engine
  mapAnalytics/      grid clustering
  prisma/            schema + migrations
```

## Status

Archived. Built during the Meta University internship program and kept public as a portfolio
reference; it is not maintained.

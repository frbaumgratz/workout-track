# Design & Tech Decisions

## Data Storage
- Chose MongoDB for flexibility with tracking different types of exercises
- Data is stored remotely (not localStorage or IndexedDB)

## Date Model
- Store entries by `dateKey` in format `YYYY-MM-DD` (string)
- Default timezone: `America/Sao_Paulo` (configurable via `NUXT_PUBLIC_TIME_ZONE`)
- Benefits: predictable querying/sorting; avoids client/server timezone drift

## Auth
- Not included in MVP to keep scope small
- Will consider user accounts once multi-user support is needed

## Mobile Support
- Deferred for now due to lack of need
- Will revisit if user demand arises

## API Conventions
- Nitro file-based routes with method suffix: `.get.ts`, `.post.ts`, `.put.ts`, `.delete.ts`
- Error shape: `{ error, message }` with status set via `setResponseStatus`

## Data Integrity
- Activities are referenced by name within entries (simple strings)
- Renaming an activity cascades the change across entries
- Deleting an activity from the master list does not remove historical data; orphan names remain in entries until cleaned

## Tools
- Tools menu allows bulk cleaning: remove an activity from entries in a date range; clear entries in a date range
- Dialog closes after confirm and raises a refresh event; toast confirms success/error

## Summary & Metrics
- Month totals: days active (≥ 1 activity) and total activities
- Year-to-date (YTD) totals: same metrics with cut-off at the end of the focused month
- Per-activity counts shown for Month and YTD

## Streaks
- Any-activity streak: consecutive days with ≥ 1 activity; multiple activities on the same day count as 1 for this streak
- Per-activity streak: consecutive days that include a specific activity; counts 1 per day
- Negative streak: consecutive days with no activities and no scheduled rest
- Scheduled rest does not break streaks and does not increment them
- Streaks are calculated and displayed for Month and YTD

## Rest Days
- Entries support an optional `rest: boolean`
- When `rest` is true, `activities` is stored as an empty list (saving rest clears activities)
- Rest days do not count toward "days active" nor toward "total activities"

## Calendar Visual Rules
- Days with activities are highlighted (green)
- Scheduled rest days are highlighted (yellow)
- Negative streak runs with length ≥ 4 are highlighted (red)

## API Updates
- `PUT /api/entries` accepts `{ dateKey | date, activities?: string[], rest?: boolean }`
- `GET /api/entries` returns entries with the optional `rest` flag

## Backwards Compatibility
- No schema migration required; the `rest` flag is optional and defaults to `false`
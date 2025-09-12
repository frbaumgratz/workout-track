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

# Project Context: Exercise Tracking Calendar

## Project Goal
Build a customized web-based calendar that helps users visually and quantitatively track their physical exercises over time.

---

## Project Description

I follow a multi-exercise training program that involves multiple types of physical activities like:

- Swimming
- Running
- Walking
- Playing basketball
- Gym workouts

Sometimes I train twice a day. Over time, it becomes hard to remember what I did last week or even yesterday.

**This project aims to:**

- Provide a visual calendar interface where I can log activities each day
- Allow me to select which exercises I performed on a specific date
- Display that information clearly (e.g., via colored days or exercise labels)
- Generate weekly, monthly, and yearly summaries of how often I did each activity

## Core Features

### 1. Calendar Interface
- A large calendar view should occupy the majority of the screen
- Clicking on a day opens a panel or modal to check off which exercises were done
- Once an exercise is marked:
  - The day should visually change (e.g., background color and/or icon added)
  - Optionally, show which exercises were completed that day

### 2. Exercise Logging
- User can mark multiple exercises per day
- Data must be persisted (saved to database) so it can be retrieved later
- Users can edit entries for previous days

### 3. Summary Sidebar
- Always-visible sidebar (or collapsible panel)
- Displays the total number of times each exercise was performed:
  - This week
  - This month
  - This year
  - (Optional) per custom date range
  - Example output: Swimming: 3 times (Week 1), 4 times (Week 2), 7 times (This Month)

### 4. Customization
- Ability to define which exercises are tracked
- Optional: Add/remove exercise types

---

## Tech Stack

- **Nuxt.js** (Latest version)
- **Vue 3**
- **Tailwind CSS v4**
- **MongoDB**

---

## Data Storage

- Use MongoDB as the primary database
- Data should be saved remotely (not local-only)
- Must persist across sessions and devices
- No third-party fitness tracker integrations are required

## Development Guidelines

- Prioritize a **modern, clean UI**
- After implementing each feature, **ask for manual testing and validation**
- Ensure **all exercises are tracked persistently**
- Use best practices for responsive design

---

## Layout Overview

- **Main Area**: Calendar view
- **Sidebar**: Exercise summary and statistics (exercise frequency)
- **Visual Feedback**:
    - Days change color based on activity status
    - Display completed exercises per day (e.g., badges or icons)

---

## Potential Future Features (Optional)

_Not required for MVP, but worth considering later:_

- Export stats to CSV or PDF
- Notifications/reminders to log activity
- Visual charts/graphs
- Another page with another calendar to track pains and days I did something bad to my body (like drinking, not resting, etc)
- A result page that would sum both pages
- **Multi-user support**: The app will initially be personal-only but may evolve to support multiple users in the future.
- **User authentication**: Not required for the MVP. Can be added later when multi-user support is introduced.

## Summary of MVP Limitations

- Single-user only
- No login or authentication
- No external service integration
- No mobile or PWA support



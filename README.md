# TherapyTracker

TherapyTracker is a healthcare workflow application designed to simplify outpatient and assisted living therapy documentation and scheduling.

Built by a Physical Therapist Assistant (PTA) transitioning into software engineering, TherapyTracker was created to solve real workflow problems encountered during daily patient care.

## Why TherapyTracker?

Current documentation systems focus on billing but often overlook clinician workflow.

TherapyTracker aims to reduce documentation time by organizing common therapy interventions, generating consistent treatment narratives, and helping therapists track Medicare scheduling requirements.

## Features

- Patient management
- Physical Therapy documentation
- Therapeutic Exercise documentation
- Therapeutic Activity documentation
- Gait Training documentation
- Neuromuscular Re-education documentation
- Automatic treatment narrative generation
- Medicare visit tracking
- PT supervisory visit reminders
- 5-visit PTA rule tracking
- Weekday scheduling support

## Tech Stack

Frontend

- React
- Vite

Backend

- Node.js
- Express

Database

- PostgreSQL
- Prisma ORM

## Current Status

🚧 Active development

Current focus includes:

- Expanding database persistence and improving documentation workflows
- AI-assisted note generation
- Scheduling enhancements

## Current Documentation Workflow

TherapyTracker supports four intervention categories:

- Therapeutic Activity
- Therapeutic Exercise
- Neuromuscular Re-education
- Gait Training

Intervention forms use React state to manage user input
and connect to an Express backend with PostgreSQL
and Prisma for database persistence.

### QuickCapture

QuickCapture currently manages treatment notes in
React state without database persistence.

Planned improvements include:

- AI-assisted intervention categorization
- Separate narrative generation for each intervention
- Clinician review and editing before finalizing notes
- Secure handling of clinical information

## Motivation

As a practicing PTA, documentation often extends well beyond patient care hours.

TherapyTracker was designed from firsthand clinical experience to reduce administrative burden while supporting accurate Medicare documentation.

## Future Goals

- Authentication and user accounts
- PT/PTA/OT/OTA role support
- AI-assisted documentation
- Family communication portal
- HIPAA-compliant deployment
- Medicare scheduling reminders
- five visit PTA rule tracking for sup visits, 30 day visits

## Author

Victoria Kruszewski

Physical Therapist Assistant transitioning into Software Engineering.

Healthcare workflow automation • React • Node.js • PostgreSQL • Prisma

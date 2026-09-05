// RushEvents.tsx

import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Box, Paper, Typography } from '@mui/material';
import { Event as EventIcon, AccessTime as AccessTimeIcon, Place as PlaceIcon } from '@mui/icons-material';
import { FadeInSection } from './FadeInSection';  

interface RushEvent {
  _id?: string;
  Name: string;
  Day: string;
  EndDay?: string;
  Time: string;
  Location: string;
  Description: string;
}

/** The timezone events are stored in (Boston / Eastern Time). */
const SOURCE_TZ = 'America/New_York';

/**
 * Parse a date string (e.g. "2025-09-13") as a local date,
 * avoiding timezone shift issues from UTC parsing.
 */
function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
};

/**
 * Format the display date for an event.
 * Single-day: "Saturday, September 13"
 * Multi-day:  "Saturday, September 13 – Sunday, September 14"
 */
function formatEventDate(day: string, endDay?: string): string {
  const start = parseLocalDate(day);
  const startStr = start.toLocaleDateString('en-US', dateFormatOptions);

  if (!endDay || endDay === day) {
    return startStr;
  }

  const end = parseLocalDate(endDay);
  const endStr = end.toLocaleDateString('en-US', dateFormatOptions);
  return `${startStr} – ${endStr}`;
}

/**
 * Convert a 24-hour time string stored in Eastern Time to the
 * user's local timezone, displayed in 12-hour format.
 *
 * e.g. "19:00" on "2026-09-13" → "7:00 PM" (Eastern)
 *      or "4:00 PM" if the user is in Pacific Time.
 *
 * Supports time ranges in any common separator format:
 * "19:00 - 21:00", "19:00-21:00", "19:00 – 21:00"
 */
function formatEventTime(day: string, time: string): string {
  // Match a time range: two HH:MM groups separated by dash/en-dash with optional spaces
  const rangeMatch = time.match(/^(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})$/);

  if (rangeMatch) {
    return `${convertSingleTime(day, rangeMatch[1])} – ${convertSingleTime(day, rangeMatch[2])}`;
  }

  return convertSingleTime(day, time);
}

/**
 * Convert a single 24h time (e.g. "19:00") on a given date from
 * Eastern Time to the browser's local timezone in 12-hour format.
 */
function convertSingleTime(day: string, time: string): string {
  // Match 24h "HH:MM" format
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time; // not parseable, return as-is

  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);

  // Build an ISO-ish string interpreted in Eastern Time by using
  // Intl to figure out the UTC offset for the source timezone.
  // We construct a Date in UTC, then adjust by the Eastern offset.
  const [year, mon, d] = day.split('-').map(Number);

  // Create a reference date in UTC
  const utcRef = new Date(Date.UTC(year, mon - 1, d, hour, minute));

  // Get the Eastern Time offset for this date by comparing formatted output
  const easternStr = utcRef.toLocaleString('en-US', { timeZone: SOURCE_TZ });
  const easternDate = new Date(easternStr);
  const offsetMs = utcRef.getTime() - easternDate.getTime();

  // The actual UTC time: Eastern time + offset
  const actualUtc = new Date(utcRef.getTime() + offsetMs);

  // Format in the user's local timezone
  return actualUtc.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function RushEvents({ events }: { events: RushEvent[] }) {
  return (
    <Timeline position="alternate">
      {events.map((event, index) => (
        <TimelineItem key={event._id ?? index}>
          <TimelineSeparator>
            <TimelineDot sx={{ backgroundColor: '#134b91', color: 'white' }}>
              <EventIcon />
            </TimelineDot>
            {index < events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent sx={{ py: 2 }}>
            {/* Wrap our card in the FadeInSection */}
            <FadeInSection>
              <Paper elevation={3} sx={{ p: 3, display: 'inline-block', maxWidth: '460px', width: '100%', textAlign: 'left' }}>
                {/* Event Name */}
                <Typography
                  variant="h6"
                  component="h1"
                  gutterBottom
                  sx={{ textAlign: 'left', fontWeight: 'bold', mb: 1.5 }}
                >
                  {event.Name}
                </Typography>

                {/* Date & Time */}
                <Box display="flex" alignItems="flex-start" gap={1} mb={1} flexWrap="wrap">
                  <AccessTimeIcon fontSize="small" sx={{ flexShrink: 0, mt: '2px' }} />
                  <Typography variant="body2" sx={{ textAlign: 'left' }}>
                    {formatEventDate(event.Day, event.EndDay)}, {formatEventTime(event.Day, event.Time)}
                  </Typography>
                </Box>

                {/* Location — only render if present */}
                {event.Location && (
                  <Box display="flex" alignItems="flex-start" gap={1} mb={1} flexWrap="wrap">
                    <PlaceIcon fontSize="small" sx={{ flexShrink: 0, mt: '2px' }} />
                    <Typography variant="body2" sx={{ textAlign: 'left' }}>
                      {event.Location}
                    </Typography>
                  </Box>
                )}

                {/* Description — split on semicolons into separate lines */}
                {event.Description && (
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'left' }}>
                    {event.Description.split(';').map((part, i, arr) => (
                      <span key={i}>
                        {part.trim()}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </Typography>
                )}
              </Paper>
            </FadeInSection>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

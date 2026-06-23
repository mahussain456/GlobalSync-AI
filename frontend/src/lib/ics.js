/**
 * Generates and downloads a standard RFC 5545 iCalendar (.ics) file
 * 
 * @param {string} teamName - Name of the team/workspace
 * @param {Date} startUtcDate - UTC Date of the meeting start
 * @param {number} durationHours - Duration of the meeting in decimal hours
 */
export function generateIcsFile(teamName, startUtcDate, durationHours = 1) {
  const pad = (n) => String(n).padStart(2, '0');
  
  const formatDate = (d) => {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  };
  
  const now = new Date();
  const endUtcDate = new Date(startUtcDate.getTime() + durationHours * 3600000);
  
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GlobalSync AI//Team Workspace//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${now.getTime()}-${Math.random().toString(36).substring(2, 8)}@globalsync-ai.com`,
    `DTSTAMP:${formatDate(now)}`,
    `DTSTART:${formatDate(startUtcDate)}`,
    `DTEND:${formatDate(endUtcDate)}`,
    `SUMMARY:Sync Meeting — ${teamName || "Team"}`,
    `DESCRIPTION:Scheduled via GlobalSync AI Team Workspace.\nLink: ${window.location.href}`,
    'SEQUENCE:0',
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  
  const fileContent = icsLines.join('\r\n');
  const blob = new Blob([fileContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(teamName || "team").toLowerCase().replace(/[^a-z0-9]+/g, '_')}_sync_meeting.ics`;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

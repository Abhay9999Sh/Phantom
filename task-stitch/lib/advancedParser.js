/**
 * Advanced Natural Language Parser for Jarvis
 * Handles ALL CRUD operations with deep understanding
 */

/**
 * Main parser - analyzes user intent and extracts all parameters
 */
export function parseCommand(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // 1. DELETE Operations
  if (lowerMessage.match(/delete|remove|cancel/)) {
    return parseDelete(userMessage);
  }
  
  // 2. UPDATE Operations
  if (lowerMessage.match(/update|change|modify|rename|reschedule|move/)) {
    return parseUpdate(userMessage);
  }
  
  // 3. QUERY/SEARCH Operations
  // Also trigger on "event/events before/after/on/between/in" without explicit "show"
  if (lowerMessage.match(/show|list|get|find|search|what|display|view|how many|count|tell me|events?\s+(before|after|on|between|in)/)) {
    return parseQuery(userMessage);
  }
  
  // 4. CREATE Operations
  if (lowerMessage.match(/create|add|schedule|organize|plan/)) {
    return parseCreate(userMessage);
  }
  
  // 5. FACULTY Operations
  if (lowerMessage.match(/absent|mark|teacher|faculty|professor/)) {
    return parseFaculty(userMessage);
  }
  
  // 6. NOTIFICATION Operations
  if (lowerMessage.match(/notify|announce|send|broadcast|alert/)) {
    return parseNotification(userMessage);
  }
  
  // Default: general chat
  return {
    name: 'general_chat',
    args: {
      reply: `I'm Jarvis, your advanced assistant. I can:\n\n📅 **Events:** Create, Update, Delete, Search\n👨‍🏫 **Faculty:** Mark absences\n📢 **Notifications:** Send announcements\n\nTry: "Show events in next 3 months" or "Update event name to new name"`
    }
  };
}

/**
 * Parse DELETE commands
 * Examples:
 * - "delete AI Workshop"
 * - "remove event named Tech Talk"
 * - "cancel the hackathon"
 * - "delete events on 5 Jan"
 * - "delete events before 10 Jan"
 */
function parseDelete(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for date-based deletion
  const onDateMatch = message.match(/(?:delete|remove|cancel)\s+(?:events?\s+)?on\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december))/i);
  if (onDateMatch) {
    return {
      name: 'delete_by_date',
      args: { on_date: onDateMatch[1].trim() }
    };
  }
  
  const beforeDateMatch = message.match(/(?:delete|remove|cancel)\s+(?:events?\s+)?before\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december))/i);
  if (beforeDateMatch) {
    return {
      name: 'delete_by_date',
      args: { before_date: beforeDateMatch[1].trim() }
    };
  }
  
  const afterDateMatch = message.match(/(?:delete|remove|cancel)\s+(?:events?\s+)?after\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december))/i);
  if (afterDateMatch) {
    return {
      name: 'delete_by_date',
      args: { after_date: afterDateMatch[1].trim() }
    };
  }
  
  // Pattern 1: "delete [event name]" - but not if it contains date keywords
  if (!lowerMessage.includes(' on ') && !lowerMessage.includes(' before ') && !lowerMessage.includes(' after ')) {
    const pattern1 = message.match(/(?:delete|remove|cancel)\s+(?:event\s+)?(?:named\s+)?(?:the\s+)?(.+?)(?:\s+event)?$/i);
    
    if (pattern1) {
      const title = pattern1[1].trim();
      // Don't treat dates as titles
      if (!/^\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(title)) {
        return {
          name: 'delete_event',
          args: { event_title: title }
        };
      }
    }
  }
  
  return null;
}

/**
 * Helper: Parse simple date to YYYY-MM-DD
 */
function parseSimpleDate(dateStr, defaultYear) {
  const months = {
    'jan': 1, 'january': 1,
    'feb': 2, 'february': 2, 'feburary': 2,
    'mar': 3, 'march': 3,
    'apr': 4, 'april': 4,
    'may': 5,
    'jun': 6, 'june': 6,
    'jul': 7, 'july': 7,
    'aug': 8, 'august': 8,
    'sep': 9, 'september': 9,
    'oct': 10, 'october': 10,
    'nov': 11, 'november': 11,
    'dec': 12, 'december': 12
  };

  const match = dateStr.match(/(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)/i);
  if (match) {
    const day = parseInt(match[1]);
    const month = months[match[2].toLowerCase()];
    return `${defaultYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  
  return dateStr;
}

/**
 * Parse UPDATE commands
 * Examples:
 * - "update hacksilly event name to hackonly"
 * - "change AI workshop time to 5 PM"
 * - "reschedule Tech Talk to tomorrow"
 * - "move event to Lab 301"
 * - "rename workshop to Advanced AI"
 */
function parseUpdate(message) {
  const updates = {};
  let eventTitle = null;
  
  // Extract which event to update
  // Pattern: "update [event name] ..."
  const eventMatch = message.match(/(?:update|change|modify|rename|reschedule|move)\s+(?:event\s+)?(?:the\s+)?([^\\s]+(?:\\s+[^\\s]+)?)\s+(?:event\s+)?(?:name|title|time|date|location|to|at)/i);
  
  if (eventMatch) {
    eventTitle = eventMatch[1].trim();
  }
  
  // Extract what to update
  
  // 1. NAME/TITLE update
  const nameMatch = message.match(/(?:name|title|rename|called)\s+to\s+(.+?)(?:\s|$)/i);
  if (nameMatch) {
    updates.title = nameMatch[1].trim();
  }
  
  // 2. TIME update
  const timeMatch = message.match(/time\s+to\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] || '00';
    const meridiem = timeMatch[3]?.toLowerCase();
    if (meridiem === 'pm' && hour !== 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    updates.time = `${String(hour).padStart(2, '0')}:${minute}`;
  }
  
  // 3. DATE update
  if (message.match(/(?:date|day|reschedule)\s+to\s+tomorrow/i)) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    updates.date = tomorrow.toISOString().split('T')[0];
  }
  
  const dateMatch = message.match(/(?:date|day)\s+to\s+(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i);
  if (dateMatch) {
    const months = {
      'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'mar': 3, 'march': 3,
      'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6,
      'jul': 7, 'july': 7, 'aug': 8, 'august': 8, 'sep': 9, 'september': 9,
      'oct': 10, 'october': 10, 'nov': 11, 'november': 11, 'dec': 12, 'december': 12
    };
    const month = months[dateMatch[2].toLowerCase()];
    updates.date = `${dateMatch[3]}-${String(month).padStart(2, '0')}-${String(dateMatch[1]).padStart(2, '0')}`;
  }
  
  // 4. LOCATION update
  const locationMatch = message.match(/(?:location|venue|place|room)\s+to\s+(.+?)(?:\s|$)/i) ||
                       message.match(/move\s+(?:to|at)\s+(.+?)(?:\s|$)/i);
  if (locationMatch) {
    updates.location = locationMatch[1].trim();
  }
  
  if (eventTitle && Object.keys(updates).length > 0) {
    return {
      name: 'update_event',
      args: { event_title: eventTitle, updates }
    };
  }
  
  return null;
}

/**
 * Parse QUERY/SEARCH commands
 * Examples:
 * - "show events in next 3 months"
 * - "list all events"
 * - "find events in Lab 204"
 * - "what events are today"
 * - "search for AI workshop"
 */
function parseQuery(message) {
  const lowerMessage = message.toLowerCase();
  const queryParams = {};
  
  // Check for BEFORE YEAR queries (e.g., "before 2026")
  const beforeYearMatch = message.match(/before\s+(\d{4})/i);
  if (beforeYearMatch) {
    const year = beforeYearMatch[1];
    console.log('✅ BEFORE YEAR query detected:', year);
    return {
      name: 'advanced_query',
      args: { before_date: `1 Jan ${year}` }
    };
  }
  
  // Check for AFTER YEAR queries (e.g., "after 2025")
  const afterYearMatch = message.match(/after\s+(\d{4})/i);
  if (afterYearMatch) {
    const year = afterYearMatch[1];
    console.log('✅ AFTER YEAR query detected:', year);
    return {
      name: 'advanced_query',
      args: { after_date: `31 Dec ${year}` }
    };
  }
  
  // Check for IN MONTH queries (e.g., "in february", "in feb")
  const inMonthMatch = message.match(/in\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|feburary|march|april|may|june|july|august|september|october|november|december)(?:\s+(\d{4}))?/i);
  if (inMonthMatch) {
    const month = inMonthMatch[1];
    const year = inMonthMatch[2] || new Date().getFullYear();
    console.log('✅ IN MONTH query detected:', month, year);
    
    // Get first and last day of month
    const months = {
      'jan': 1, 'january': 1,
      'feb': 2, 'february': 2, 'feburary': 2,
      'mar': 3, 'march': 3,
      'apr': 4, 'april': 4,
      'may': 5,
      'jun': 6, 'june': 6,
      'jul': 7, 'july': 7,
      'aug': 8, 'august': 8,
      'sep': 9, 'september': 9,
      'oct': 10, 'october': 10,
      'nov': 11, 'november': 11,
      'dec': 12, 'december': 12
    };
    
    const monthNum = months[month.toLowerCase()];
    const lastDay = new Date(year, monthNum, 0).getDate();
    
    return {
      name: 'advanced_query',
      args: {
        between_start: `1 ${month} ${year}`,
        between_end: `${lastDay} ${month} ${year}`
      }
    };
  }
  
  // Check for BEFORE DATE queries (with or without year)
  const beforeMatch = message.match(/before\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|feburary|march|april|may|june|july|august|september|october|november|december)(?:\s+\d{4})?)/i);
  if (beforeMatch) {
    console.log('✅ BEFORE query detected:', beforeMatch[1]);
    return {
      name: 'advanced_query',
      args: { before_date: beforeMatch[1].trim() }
    };
  }
  
  // Check for AFTER DATE queries (with or without year)
  const afterMatch = message.match(/after\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|feburary|march|april|may|june|july|august|september|october|november|december)(?:\s+\d{4})?)/i);
  if (afterMatch) {
    console.log('✅ AFTER query detected:', afterMatch[1]);
    return {
      name: 'advanced_query',
      args: { after_date: afterMatch[1].trim() }
    };
  }
  
  // Check for ON specific date
  const onDateMatch = message.match(/on\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december))/i);
  if (onDateMatch && (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('events'))) {
    const currentYear = new Date().getFullYear();
    const parsedDate = parseSimpleDate(onDateMatch[1].trim(), currentYear);
    console.log('✅ ON date query detected:', onDateMatch[1]);
    return {
      name: 'advanced_query',
      args: { 
        between_start: parsedDate,
        between_end: parsedDate
      }
    };
  }
  
  // Check for BETWEEN queries
  const betweenMatch = message.match(/between\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december))\s+and\s+(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december))/i);
  if (betweenMatch) {
    console.log('✅ BETWEEN query detected:', betweenMatch[1], 'and', betweenMatch[2]);
    return {
      name: 'advanced_query',
      args: {
        between_start: betweenMatch[1].trim(),
        between_end: betweenMatch[2].trim()
      }
    };
  }
  
  // Handle "how many" questions - always query all upcoming
  if (lowerMessage.includes('how many') || lowerMessage.includes('count')) {
    // Check if asking about specific timeframe
    if (/today/i.test(message)) queryParams.timeframe = 'today';
    else if (/tomorrow/i.test(message)) queryParams.timeframe = 'tomorrow';
    else if (/this week/i.test(message)) queryParams.timeframe = 'this_week';
    else if (/this month/i.test(message)) queryParams.timeframe = 'this_month';
    else if (/next 3 months/i.test(message)) queryParams.timeframe = 'next_3_months';
    else queryParams.timeframe = 'upcoming'; // Default to all upcoming
    
    return {
      name: 'advanced_query',
      args: queryParams
    };
  }
  
  // Timeframe detection
  if (/today/i.test(message)) queryParams.timeframe = 'today';
  else if (/tomorrow/i.test(message)) queryParams.timeframe = 'tomorrow';
  else if (/this week|next week/i.test(message)) queryParams.timeframe = 'this_week';
  else if (/this month|next month/i.test(message)) queryParams.timeframe = 'this_month';
  else if (/next 3 months|next three months|3 months/i.test(message)) queryParams.timeframe = 'next_3_months';
  else if (/upcoming|future/i.test(message)) queryParams.timeframe = 'upcoming';
  else if (/past|previous|old/i.test(message)) queryParams.timeframe = 'past';
  else if (/all|everything/i.test(message)) queryParams.timeframe = 'upcoming';
  
  // Location filter
  const locationMatch = message.match(/(?:in|at)\s+([a-z0-9\s]+?)(?:\s+(?:today|tomorrow|this|next)|$)/i);
  if (locationMatch) {
    queryParams.location = locationMatch[1].trim();
  }
  
  // Search term
  const searchMatch = message.match(/(?:for|named|called)\s+([a-z0-9\s]+?)(?:\s|$)/i);
  if (searchMatch) {
    queryParams.search = searchMatch[1].trim();
  }
  
  // If we have any query params, return query_events
  if (Object.keys(queryParams).length > 0) {
    return {
      name: 'query_events',
      args: queryParams
    };
  }
  
  // Default: show all upcoming events
  return {
    name: 'query_events',
    args: { timeframe: 'upcoming' }
  };
}

/**
 * Parse CREATE commands
 * Examples:
 * - "create AI workshop tomorrow at 3 PM in Lab 204"
 * - "add event named Tech Talk on 5 Nov 2025 at 6 PM in BPIT"
 * - "schedule hackathon for next Monday at 9 AM in Main Hall"
 */
function parseCreate(message) {
  const details = {
    title: null,
    date: null,
    time: null,
    location: null
  };
  
  // Extract TITLE
  // Pattern 1: "create [title] tomorrow/on/at"
  const titleMatch1 = message.match(/(?:create|add|schedule)\s+(?:event\s+)?(?:named\s+)?([a-zA-Z0-9\\s]+?)\s+(?:on|at|for|tomorrow|today|\d)/i);
  // Pattern 2: "event named [title]"
  const titleMatch2 = message.match(/event\s+(?:named|called)\s+([a-zA-Z0-9\\s]+?)\s+(?:on|at)/i);
  
  const titleMatch = titleMatch1 || titleMatch2;
  if (titleMatch) {
    details.title = titleMatch[1].trim();
  }
  
  // Extract DATE
  if (/tomorrow/i.test(message)) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    details.date = tomorrow.toISOString().split('T')[0];
  } else if (/today/i.test(message)) {
    details.date = new Date().toISOString().split('T')[0];
  } else {
    // Pattern: "5 Nov 2025" or "5 November 2025"
    const dateMatch = message.match(/(\\d{1,2})\\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\\s+(\\d{4})/i);
    if (dateMatch) {
      const months = {
        'jan': 1, 'january': 1, 'feb': 2, 'february': 2, 'feburary': 2, 'mar': 3, 'march': 3,
        'apr': 4, 'april': 4, 'may': 5, 'jun': 6, 'june': 6,
        'jul': 7, 'july': 7, 'aug': 8, 'august': 8, 'sep': 9, 'september': 9,
        'oct': 10, 'october': 10, 'nov': 11, 'november': 11, 'dec': 12, 'december': 12
      };
      const month = months[dateMatch[2].toLowerCase()];
      details.date = `${dateMatch[3]}-${String(month).padStart(2, '0')}-${String(dateMatch[1]).padStart(2, '0')}`;
    }
  }
  
  // Extract TIME
  const timeMatch = message.match(/(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] || '00';
    const meridiem = timeMatch[3]?.toLowerCase();
    if (meridiem === 'pm' && hour !== 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    details.time = `${String(hour).padStart(2, '0')}:${minute}`;
  }
  
  // Extract LOCATION
  const locationMatch = message.match(/(?:in|at)\s+([a-z0-9\\s]+?)(?:\\s|$)/i);
  if (locationMatch) {
    details.location = locationMatch[1].trim();
  }
  
  // Check if we have minimum required fields
  if (details.title && details.date && details.time) {
    // Set default location if missing
    if (!details.location) {
      details.location = 'TBD';
    }
    return {
      name: 'create_event',
      args: details
    };
  }
  
  return null;
}

/**
 * Parse FACULTY commands
 */
function parseFaculty(message) {
  const details = {
    teacher_name: null,
    date: null
  };
  
  // Extract teacher name
  const nameMatch = message.match(/(?:Dr\\.?|Prof\\.?|Mr\\.?|Mrs\\.?|Ms\\.?)\\s+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)/i);
  if (nameMatch) {
    details.teacher_name = nameMatch[0].trim();
  }
  
  // Extract date
  if (/today/i.test(message)) {
    details.date = new Date().toISOString().split('T')[0];
  } else if (/tomorrow/i.test(message)) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    details.date = tomorrow.toISOString().split('T')[0];
  }
  
  if (details.teacher_name && details.date) {
    return {
      name: 'mark_teacher_absent',
      args: details
    };
  }
  
  return null;
}

/**
 * Parse NOTIFICATION commands
 */
function parseNotification(message) {
  const details = {
    recipient: null,
    message: null
  };
  
  // Extract recipient
  const recipientMatch = message.match(/(?:to|notify)\\s+(all\\s+students|students|faculty|staff|everyone|coordinator)/i);
  if (recipientMatch) {
    details.recipient = recipientMatch[1].trim();
  }
  
  // Extract message
  const messageMatch = message.match(/about\\s+(.+?)(?:\\.|$)/i);
  if (messageMatch) {
    details.message = messageMatch[1].trim();
  }
  
  if (details.recipient && details.message) {
    return {
      name: 'send_notification',
      args: details
    };
  }
  
  return null;
}

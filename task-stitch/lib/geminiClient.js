/**
 * The "Brain" - Gemini AI Client
 * This decides which tool to call based on user input
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseCommand } from './advancedParser';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('Missing GEMINI_API_KEY - using fallback parser');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Define the tools available to Jarvis
const tools = [
  {
    name: 'create_event',
    description: 'Creates a new event in the campus calendar. Use this when the user wants to schedule, add, or create an event, workshop, seminar, or any campus activity.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'The name or title of the event',
        },
        date: {
          type: 'string',
          description: 'The date of the event in YYYY-MM-DD format',
        },
        time: {
          type: 'string',
          description: 'The time of the event in HH:MM format (24-hour)',
        },
        location: {
          type: 'string',
          description: 'The location or venue of the event',
        },
      },
      required: ['title', 'date', 'time', 'location'],
    },
  },
  {
    name: 'mark_teacher_absent',
    description: 'Marks a teacher/faculty member as absent for a specific date and notifies the coordinator. Use this when someone reports a teacher is absent or not available.',
    parameters: {
      type: 'object',
      properties: {
        teacher_name: {
          type: 'string',
          description: 'The full name of the teacher',
        },
        date: {
          type: 'string',
          description: 'The date of absence in YYYY-MM-DD format',
        },
      },
      required: ['teacher_name', 'date'],
    },
  },
  {
    name: 'send_notification',
    description: 'Sends a notification or announcement to a specific recipient or group. Use this for broadcasting messages, alerts, or announcements.',
    parameters: {
      type: 'object',
      properties: {
        recipient: {
          type: 'string',
          description: 'Who should receive the notification (e.g., "All Students", "Faculty", "Coordinator")',
        },
        message: {
          type: 'string',
          description: 'The notification message content',
        },
      },
      required: ['recipient', 'message'],
    },
  },
  {
    name: 'general_chat',
    description: 'Use this for general conversation, greetings, unclear queries, or when you need to ask clarifying questions. Also use this to provide helpful responses when the user request doesn\'t match other tools.',
    parameters: {
      type: 'object',
      properties: {
        reply: {
          type: 'string',
          description: 'Your conversational response to the user',
        },
      },
      required: ['reply'],
    },
  },
];

const systemInstruction = `You are "Jarvis", an intelligent campus automation assistant for a college or university.

Your primary responsibilities:
- Analyze user requests and determine the appropriate action
- Create events, workshops, and campus activities
- Mark faculty absences and trigger notifications
- Send announcements and notifications
- Engage in helpful conversation

Guidelines:
1. When a user wants to create an event, extract all details (title, date, time, location)
2. If information is missing, use 'general_chat' to ask clarifying questions
3. For date references like "tomorrow", "next Monday", calculate the actual date
4. For time references like "3 PM", convert to 24-hour format (15:00)
5. Be friendly, professional, and efficient
6. If a request is unclear or you're unsure, use 'general_chat' to ask for clarification
7. Always confirm actions in a natural, conversational way

Today's date: ${new Date().toISOString().split('T')[0]}

Remember: You must ALWAYS call one of the available tools. Choose the most appropriate tool for each user message.`;

/**
 * Analyzes user message and determines which tool to call
 * @param {string} userMessage - The user's input message
 * @returns {Object} { name: string, args: Object } - The function to call and its arguments
 */
export async function getAICommand(userMessage) {
  try {
    // Use advanced parser first - it handles ALL operations
    const parsedIntent = parseCommand(userMessage);
    
    // If we got a clear intent with all required params, return it
    if (parsedIntent && parsedIntent.name !== 'general_chat') {
      console.log('✅ Advanced parser matched:', parsedIntent);
      return parsedIntent;
    }
    
    // If no Gemini API, return the parsed intent anyway
    if (!genAI) {
      return parsedIntent || parseUserIntent(userMessage);
    }

    // Otherwise, use Gemini for better understanding
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const prompt = `You are Jarvis, a campus assistant. Analyze this request and extract information:

User: "${userMessage}"

If this is about creating an event, extract: title, date (YYYY-MM-DD), time (HH:MM in 24-hour), location
If this is about marking a teacher absent, extract: teacher_name, date (YYYY-MM-DD)
If this is about sending a notification, extract: recipient, message

Respond ONLY with a JSON object in this exact format:
{
  "action": "create_event" | "mark_teacher_absent" | "send_notification" | "chat",
  "data": { extracted fields here }
}

Today's date: ${new Date().toISOString().split('T')[0]}
Tomorrow's date: ${getTomorrowDate()}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return convertToFunctionCall(parsed);
      } catch (e) {
        console.error('Failed to parse Gemini response:', e);
      }
    }

    return parsedIntent;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return parseUserIntent(userMessage);
  }
}

/**
 * Helper function to get tomorrow's date
 */
function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Convert Gemini response to function call format
 */
function convertToFunctionCall(parsed) {
  const actionMap = {
    'create_event': 'create_event',
    'mark_teacher_absent': 'mark_teacher_absent',
    'send_notification': 'send_notification',
    'chat': 'general_chat',
  };

  const functionName = actionMap[parsed.action] || 'general_chat';
  
  if (functionName === 'general_chat') {
    return {
      name: 'general_chat',
      args: { reply: parsed.data?.message || "I'm not sure I understood that. Could you rephrase?" },
    };
  }

  return {
    name: functionName,
    args: parsed.data || {},
  };
}

/**
 * Smart pattern matching parser
 * Uses keyword matching and regex to extract information
 */
function parseUserIntent(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  // Check for DELETE operations FIRST (before create check)
  if (lowerMessage.includes('delete') || lowerMessage.includes('remove') || lowerMessage.includes('cancel')) {
    // Extract event title after delete/remove/cancel
    const titleMatch = userMessage.match(/(?:delete|remove|cancel)\s+(?:event\s+)?(?:the\s+)?([\w\s]+?)(?:\s+event)?$/i);
    if (titleMatch) {
      return {
        name: 'delete_event',
        args: { event_title: titleMatch[1].trim() },
      };
    }
  }

  // Check for QUERY operations
  if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('get') || 
      lowerMessage.includes('what') || lowerMessage.includes('events in')) {
    
    const queryParams = {};
    
    // Detect timeframe
    if (/today/i.test(userMessage)) queryParams.timeframe = 'today';
    else if (/tomorrow/i.test(userMessage)) queryParams.timeframe = 'tomorrow';
    else if (/this week/i.test(userMessage)) queryParams.timeframe = 'this_week';
    else if (/this month/i.test(userMessage)) queryParams.timeframe = 'this_month';
    else if (/next 3 months|next three months/i.test(userMessage)) queryParams.timeframe = 'next_3_months';
    else if (/upcoming/i.test(userMessage)) queryParams.timeframe = 'upcoming';
    
    // If we have a timeframe, use query_events
    if (queryParams.timeframe) {
      return {
        name: 'query_events',
        args: queryParams,
      };
    }
  }

  // Check for UPDATE operations
  if (lowerMessage.includes('update') || lowerMessage.includes('change') || 
      lowerMessage.includes('reschedule') || lowerMessage.includes('modify')) {
    const titleMatch = userMessage.match(/(?:update|change|reschedule|modify)\s+(?:event\s+)?(?:the\s+)?([\w\s]+?)\s+(?:to|at|time)/i);
    if (titleMatch) {
      const updates = {};
      const eventTitle = titleMatch[1].trim();
      
      // Extract new time
      const timeMatch = userMessage.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] || '00';
        const meridiem = timeMatch[3]?.toLowerCase();
        if (meridiem === 'pm' && hour !== 12) hour += 12;
        if (meridiem === 'am' && hour === 12) hour = 0;
        updates.time = `${String(hour).padStart(2, '0')}:${minute}`;
      }
      
      if (Object.keys(updates).length > 0) {
        return {
          name: 'update_event',
          args: { event_title: eventTitle, updates },
        };
      }
    }
  }

  // Check for event creation
  if (
    lowerMessage.includes('create') ||
    lowerMessage.includes('add') ||
    lowerMessage.includes('schedule')
  ) {
    const eventDetails = extractEventDetails(userMessage);
    if (eventDetails.title && eventDetails.date && eventDetails.time) {
      return {
        name: 'create_event',
        args: eventDetails,
      };
    }
  }

  // Check for absence marking
  if (lowerMessage.includes('absent') || lowerMessage.includes('mark')) {
    const absenceDetails = extractAbsenceDetails(userMessage);
    if (absenceDetails.teacher_name && absenceDetails.date) {
      return {
        name: 'mark_teacher_absent',
        args: absenceDetails,
      };
    }
  }

  // Check for notifications
  if (lowerMessage.includes('notify') || lowerMessage.includes('announce') || lowerMessage.includes('send')) {
    const notifDetails = extractNotificationDetails(userMessage);
    if (notifDetails.recipient && notifDetails.message) {
      return {
        name: 'send_notification',
        args: notifDetails,
      };
    }
  }

  // Default to general chat
  return {
    name: 'general_chat',
    args: {
      reply: `Hello! I'm Jarvis. I can help you:\n\n📅 **Event Management:**\n• Create: "Create AI workshop tomorrow at 3 PM in Lab 204"\n• Delete: "Delete AI Workshop"\n• Update: "Reschedule AI workshop to 5 PM"\n• Query: "Show events in next 3 months"\n\n👨‍🏫 **Faculty:** Mark absences\n📢 **Notifications:** Send announcements\n\nWhat would you like to do?`,
    },
  };
}

/**
 * Extract event details from message
 */
function extractEventDetails(message) {
  const details = {
    title: null,
    date: null,
    time: null,
    location: null,
    event_id: null,
  };

  // Extract title - look for pattern like "AI workshop", "Tech seminar", "bpithacknoso", etc.
  // Pattern 1: "event NAME on/at"
  const titleMatch1 = message.match(/event\s+([a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)?)\s+on/i);
  // Pattern 2: "create/add NAME workshop/seminar"
  const titleMatch2 = message.match(/(?:create|add|schedule)\s+(?:an?\s+)?([A-Z][A-Za-z0-9]*\s+(?:workshop|seminar|event|meeting|lecture|class))/i);
  // Pattern 3: quoted text
  const titleMatch3 = message.match(/["']([^"']+)["']/i);
  
  const titleMatch = titleMatch1 || titleMatch2 || titleMatch3;
  
  if (titleMatch) {
    details.title = titleMatch[1].trim();
  } else {
    // Fallback: extract words around event keywords
    const words = message.split(/\s+/);
    const eventKeywords = ['workshop', 'seminar', 'event', 'meeting', 'lecture', 'class', 'hackathon'];
    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (eventKeywords.some(k => word.includes(k))) {
        // Get 1-2 words before the keyword
        const startIdx = Math.max(0, i - 2);
        const titleWords = words.slice(startIdx, i + 1);
        // Filter out common words
        const filtered = titleWords.filter(w => !['create', 'add', 'an', 'a', 'the', 'organize', 'will', 'we'].includes(w.toLowerCase()));
        details.title = filtered.join(' ');
        break;
      }
    }
  }

  // Extract date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (/tomorrow/i.test(message)) {
    details.date = tomorrow.toISOString().split('T')[0];
  } else if (/today/i.test(message)) {
    details.date = today.toISOString().split('T')[0];
  } else {
    // Try to extract date like "4 november 2025", "5 feburary 2026" (with typos), or "2025-11-04"
    const dateMatch = message.match(/(\d{1,2})\s+(january|jan|february|feb|feburary|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|october|oct|november|nov|december|dec)\s+(\d{4})/i) ||
                     message.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      if (dateMatch[0].includes('-')) {
        details.date = dateMatch[0];
      } else {
        const months = {
          'january': 1, 'jan': 1,
          'february': 2, 'feb': 2, 'feburary': 2,
          'march': 3, 'mar': 3,
          'april': 4, 'apr': 4,
          'may': 5,
          'june': 6, 'jun': 6,
          'july': 7, 'jul': 7,
          'august': 8, 'aug': 8,
          'september': 9, 'sep': 9,
          'october': 10, 'oct': 10,
          'november': 11, 'nov': 11,
          'december': 12, 'dec': 12
        };
        const month = months[dateMatch[2].toLowerCase()];
        details.date = `${dateMatch[3]}-${String(month).padStart(2, '0')}-${String(dateMatch[1]).padStart(2, '0')}`;
      }
    }
  }

  // Extract time
  const timeMatch = message.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i) ||
                   message.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] || '00';
    const meridiem = timeMatch[3]?.toLowerCase();
    
    if (meridiem === 'pm' && hour !== 12) hour += 12;
    if (meridiem === 'am' && hour === 12) hour = 0;
    
    details.time = `${String(hour).padStart(2, '0')}:${minute}`;
  }

  // Extract location
  const locationMatch = message.match(/(?:in|at|location|venue)\s+([a-z0-9\s]+?)(?:\s|$|,|\.)/i);
  if (locationMatch) {
    details.location = locationMatch[1].trim();
  }

  // Extract event ID
  const idMatch = message.match(/event\s+(\d+)/i);
  if (idMatch) {
    details.event_id = idMatch[1];
  }

  return details;
}

/**
 * Extract absence details
 */
function extractAbsenceDetails(message) {
  const details = {
    teacher_name: null,
    date: null,
  };

  // Extract teacher name (look for Dr., Prof., or capitalized names)
  const nameMatch = message.match(/(?:Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch) {
    details.teacher_name = nameMatch[0].trim();
  }

  // Extract date
  const today = new Date();
  if (/today/i.test(message)) {
    details.date = today.toISOString().split('T')[0];
  } else if (/tomorrow/i.test(message)) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    details.date = tomorrow.toISOString().split('T')[0];
  }

  return details;
}

/**
 * Extract notification details
 */
function extractNotificationDetails(message) {
  const details = {
    recipient: null,
    message: null,
  };

  // Extract recipient
  const recipientMatch = message.match(/(?:to|notify)\s+(all\s+students|students|faculty|staff|everyone|coordinator)/i);
  if (recipientMatch) {
    details.recipient = recipientMatch[1].trim();
  }

  // Extract message (everything after "about")
  const messageMatch = message.match(/about\s+(.+?)(?:\.|$)/i);
  if (messageMatch) {
    details.message = messageMatch[1].trim();
  }

  return details;
}

export default getAICommand;

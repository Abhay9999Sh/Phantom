/**
 * The "Hands" - Jarvis's Actionable Functions
 * Each function performs a specific database operation or action
 */

import { supabase } from './supabaseClient';
import { advancedToolBelt } from './advancedTools';

/**
 * Creates a new event in the campus calendar
 * @param {Object} params - Event details
 * @param {string} params.title - Event name
 * @param {string} params.date - Event date (YYYY-MM-DD)
 * @param {string} params.time - Event time (HH:MM)
 * @param {string} params.location - Event location
 * @returns {string} Success or error message
 */
export async function create_event({ title, date, time, location }) {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          date,
          time,
          location,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return `✅ Event "${title}" successfully created for ${date} at ${time} in ${location}.`;
  } catch (error) {
    console.error('Error creating event:', error);
    return `❌ Failed to create event: ${error.message}`;
  }
}

/**
 * Marks a teacher as absent and notifies the coordinator
 * @param {Object} params - Absence details
 * @param {string} params.teacher_name - Name of the teacher
 * @param {string} params.date - Date of absence (YYYY-MM-DD)
 * @returns {string} Success or error message
 */
export async function mark_teacher_absent({ teacher_name, date }) {
  try {
    // Update faculty status
    const { data, error } = await supabase
      .from('faculty')
      .update({ 
        status: 'Absent',
        last_updated: new Date().toISOString(),
      })
      .eq('name', teacher_name)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return `❌ Teacher "${teacher_name}" not found in the system.`;
    }

    // Send notification to coordinator
    const notificationResult = await send_notification({
      recipient: 'Coordinator',
      message: `${teacher_name} has been marked absent for ${date}. Please arrange for a substitute.`,
    });

    return `✅ ${teacher_name} marked absent for ${date}. ${notificationResult}`;
  } catch (error) {
    console.error('Error marking teacher absent:', error);
    return `❌ Failed to mark teacher absent: ${error.message}`;
  }
}

/**
 * Sends a notification/announcement
 * @param {Object} params - Notification details
 * @param {string} params.recipient - Who should receive the notification
 * @param {string} params.message - The notification message
 * @returns {string} Success message
 */
export async function send_notification({ recipient, message }) {
  try {
    // In production, this would integrate with email/SMS/push notification services
    // For now, we'll log it and store in database
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          recipient,
          message,
          sent_at: new Date().toISOString(),
          status: 'sent',
        },
      ])
      .select();

    if (error) {
      // If notifications table doesn't exist, just log it
      console.log(`📢 NOTIFICATION to ${recipient}: ${message}`);
      return `Notification logged (table may not exist yet).`;
    }

    console.log(`📢 NOTIFICATION to ${recipient}: ${message}`);
    return `Notification sent to ${recipient}.`;
  } catch (error) {
    console.log(`📢 NOTIFICATION to ${recipient}: ${message}`);
    return `Notification logged.`;
  }
}

/**
 * Handles general chat and fallback responses
 * @param {Object} params - Chat details
 * @param {string} params.reply - The AI's response text
 * @returns {string} The reply message
 */
export async function general_chat({ reply }) {
  return reply || "I'm here to help! You can ask me to create events, mark teachers absent, or send notifications.";
}

/**
 * Deletes an event from the calendar
 * @param {Object} params - Event identification
 * @param {string} params.event_id - Event ID to delete
 * @param {string} params.event_title - Event title (if ID not provided)
 * @returns {string} Success or error message
 */
export async function delete_event({ event_id, event_title }) {
  try {
    let query = supabase.from('events').delete();
    
    if (event_id) {
      query = query.eq('id', event_id);
    } else if (event_title) {
      query = query.ilike('title', `%${event_title}%`);
    } else {
      return '❌ Please provide event ID or title to delete.';
    }

    const { data, error } = await query.select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return '❌ Event not found.';
    }

    return `✅ Successfully deleted ${data.length} event(s): ${data.map(e => e.title).join(', ')}`;
  } catch (error) {
    console.error('Error deleting event:', error);
    return `❌ Failed to delete event: ${error.message}`;
  }
}

/**
 * Updates an existing event
 * @param {Object} params - Event update details
 * @param {string} params.event_id - Event ID to update
 * @param {string} params.event_title - Event title to find (if ID not provided)
 * @param {Object} params.updates - Fields to update
 * @returns {string} Success or error message
 */
export async function update_event({ event_id, event_title, updates }) {
  try {
    if (!updates || Object.keys(updates).length === 0) {
      return '❌ No updates provided.';
    }

    let query = supabase.from('events').update(updates);
    
    if (event_id) {
      query = query.eq('id', event_id);
    } else if (event_title) {
      query = query.ilike('title', `%${event_title}%`);
    } else {
      return '❌ Please provide event ID or title to update.';
    }

    const { data, error } = await query.select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return '❌ Event not found.';
    }

    return `✅ Successfully updated event: ${data[0].title}`;
  } catch (error) {
    console.error('Error updating event:', error);
    return `❌ Failed to update event: ${error.message}`;
  }
}

/**
 * Queries events based on criteria
 * @param {Object} params - Query parameters
 * @param {string} params.timeframe - 'today', 'tomorrow', 'this_week', 'this_month', 'next_3_months', etc.
 * @param {string} params.location - Filter by location
 * @param {string} params.search - Search in title
 * @returns {string} List of matching events
 */
export async function query_events({ timeframe, location, search }) {
  try {
    let query = supabase.from('events').select('*').order('date', { ascending: true });

    // Apply timeframe filter
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (timeframe) {
      switch (timeframe.toLowerCase()) {
        case 'today':
          query = query.eq('date', todayStr);
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          query = query.eq('date', tomorrow.toISOString().split('T')[0]);
          break;
        case 'this_week':
          const weekEnd = new Date(today);
          weekEnd.setDate(weekEnd.getDate() + 7);
          query = query.gte('date', todayStr).lte('date', weekEnd.toISOString().split('T')[0]);
          break;
        case 'this_month':
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          query = query.gte('date', todayStr).lte('date', monthEnd.toISOString().split('T')[0]);
          break;
        case 'next_3_months':
          const threeMonths = new Date(today);
          threeMonths.setMonth(threeMonths.getMonth() + 3);
          query = query.gte('date', todayStr).lte('date', threeMonths.toISOString().split('T')[0]);
          break;
        case 'upcoming':
          query = query.gte('date', todayStr);
          break;
        case 'past':
          query = query.lt('date', todayStr);
          break;
      }
    }

    // Apply location filter
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Apply search filter
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      return '📅 No events found matching your criteria.';
    }

    // Format the results
    const formatted = data.map(event => {
      const date = new Date(event.date);
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      return `📌 ${event.title}\n   📅 ${dateStr} at ${event.time}\n   📍 ${event.location}`;
    }).join('\n\n');

    return `Found ${data.length} event(s):\n\n${formatted}`;
  } catch (error) {
    console.error('Error querying events:', error);
    return `❌ Failed to query events: ${error.message}`;
  }
}

/**
 * Gets detailed information about a specific event
 * @param {Object} params - Event identification
 * @param {string} params.event_title - Event title to search
 * @returns {string} Event details
 */
export async function get_event_details({ event_title }) {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .ilike('title', `%${event_title}%`);

    if (error) throw error;

    if (!data || data.length === 0) {
      return `❌ No event found with title containing "${event_title}".`;
    }

    const event = data[0];
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    return `📋 Event Details:\n\n` +
           `📌 Title: ${event.title}\n` +
           `📅 Date: ${dateStr}\n` +
           `🕐 Time: ${event.time}\n` +
           `📍 Location: ${event.location}\n` +
           `🆔 ID: ${event.id}`;
  } catch (error) {
    console.error('Error getting event details:', error);
    return `❌ Failed to get event details: ${error.message}`;
  }
}

/**
 * The complete toolbelt - all available functions Jarvis can use
 */
export const toolBelt = {
  create_event,
  delete_event,
  update_event,
  query_events,
  get_event_details,
  mark_teacher_absent,
  send_notification,
  general_chat,
  // Advanced tools
  ...advancedToolBelt,
};

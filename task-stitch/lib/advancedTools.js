/**
 * ULTRA-ADVANCED CRUD Tools for Jarvis
 * Handles complex queries, date ranges, bulk operations
 */

import { supabase } from './supabaseClient';

/**
 * Advanced query with date ranges, sorting, filtering
 */
export async function advanced_query({
  timeframe,
  before_date,
  after_date,
  between_start,
  between_end,
  location,
  search,
  sort_by = 'date',
  sort_order = 'asc',
  limit
}) {
  try {
    let query = supabase.from('events').select('*');

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const currentYear = today.getFullYear();

    // Handle BEFORE queries
    if (before_date) {
      // Parse date and add current year if missing
      const parsedDate = parseDateWithYear(before_date, currentYear);
      console.log('🔍 BEFORE filter - Input:', before_date, '→ Parsed:', parsedDate);
      if (parsedDate) {
        query = query.lt('date', parsedDate);
        console.log('✅ Applied BEFORE filter: date <', parsedDate);
      }
    }

    // Handle AFTER queries
    if (after_date) {
      const parsedDate = parseDateWithYear(after_date, currentYear);
      if (parsedDate) {
        query = query.gt('date', parsedDate);
      }
    }

    // Handle BETWEEN queries
    if (between_start && between_end) {
      const startDate = parseDateWithYear(between_start, currentYear);
      const endDate = parseDateWithYear(between_end, currentYear);
      if (startDate && endDate) {
        query = query.gte('date', startDate).lte('date', endDate);
      }
    }

    // Handle standard timeframes
    if (timeframe && !before_date && !after_date && !between_start) {
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

    // Location filter
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Search filter
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // Sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Limit
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      return '📅 No events found matching your criteria.';
    }

    // Format results
    const formatted = data.map(event => {
      const date = new Date(event.date);
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      return `📌 ${event.title}\\n   📅 ${dateStr} at ${event.time}\\n   📍 ${event.location}`;
    }).join('\\n\\n');

    return `Found ${data.length} event(s):\\n\\n${formatted}`;
  } catch (error) {
    console.error('Error in advanced query:', error);
    return `❌ Query failed: ${error.message}`;
  }
}

/**
 * Delete events by date or date range
 */
export async function delete_by_date({ date, before_date, after_date, on_date }) {
  try {
    let query = supabase.from('events').delete();
    const currentYear = new Date().getFullYear();

    if (on_date || date) {
      const parsedDate = parseDateWithYear(on_date || date, currentYear);
      if (parsedDate) {
        query = query.eq('date', parsedDate);
      }
    } else if (before_date) {
      const parsedDate = parseDateWithYear(before_date, currentYear);
      if (parsedDate) {
        query = query.lt('date', parsedDate);
      }
    } else if (after_date) {
      const parsedDate = parseDateWithYear(after_date, currentYear);
      if (parsedDate) {
        query = query.gt('date', parsedDate);
      }
    }

    const { data, error } = await query.select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return '❌ No events found for the specified date.';
    }

    return `✅ Successfully deleted ${data.length} event(s) on ${on_date || date || before_date || after_date}`;
  } catch (error) {
    console.error('Error deleting by date:', error);
    return `❌ Failed to delete: ${error.message}`;
  }
}

/**
 * Get statistics about events
 */
export async function get_statistics({ timeframe = 'all' }) {
  try {
    let query = supabase.from('events').select('*');
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (timeframe !== 'all') {
      query = query.gte('date', todayStr);
    }

    const { data, error } = await query;

    if (error) throw error;

    const total = data.length;
    const byLocation = {};
    const byMonth = {};

    data.forEach(event => {
      // Count by location
      byLocation[event.location] = (byLocation[event.location] || 0) + 1;
      
      // Count by month
      const month = new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    let stats = `📊 Event Statistics:\\n\\n`;
    stats += `📈 Total Events: ${total}\\n\\n`;
    
    stats += `📍 By Location:\\n`;
    Object.entries(byLocation).forEach(([loc, count]) => {
      stats += `   • ${loc}: ${count} event(s)\\n`;
    });
    
    stats += `\\n📅 By Month:\\n`;
    Object.entries(byMonth).forEach(([month, count]) => {
      stats += `   • ${month}: ${count} event(s)\\n`;
    });

    return stats;
  } catch (error) {
    console.error('Error getting statistics:', error);
    return `❌ Failed to get statistics: ${error.message}`;
  }
}

/**
 * Bulk update events
 */
export async function bulk_update({ filter, updates }) {
  try {
    let query = supabase.from('events').update(updates);

    if (filter.location) {
      query = query.ilike('location', `%${filter.location}%`);
    }
    if (filter.date) {
      const parsedDate = parseDateWithYear(filter.date, new Date().getFullYear());
      query = query.eq('date', parsedDate);
    }
    if (filter.search) {
      query = query.ilike('title', `%${filter.search}%`);
    }

    const { data, error } = await query.select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return '❌ No events found matching the filter.';
    }

    return `✅ Successfully updated ${data.length} event(s)`;
  } catch (error) {
    console.error('Error in bulk update:', error);
    return `❌ Bulk update failed: ${error.message}`;
  }
}

/**
 * Helper: Parse date with year inference
 */
function parseDateWithYear(dateStr, defaultYear) {
  if (!dateStr) return null;

  console.log('📅 Parsing date:', dateStr, 'with default year:', defaultYear);

  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    console.log('✅ Already in YYYY-MM-DD format:', dateStr);
    return dateStr;
  }

  // Parse "5 Jan", "Jan 5", "5 January", "5 Jan 2026", etc.
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

  // Pattern: "5 Jan 2026" or "5 January 2026"
  const match1 = dateStr.match(/(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|feburary|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i);
  if (match1) {
    const day = parseInt(match1[1]);
    const month = months[match1[2].toLowerCase()];
    const year = parseInt(match1[3]);
    const result = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log('✅ Parsed with year:', result);
    return result;
  }

  // Pattern: "5 Jan" or "5 January" (no year)
  const match2 = dateStr.match(/(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|feburary|march|april|may|june|july|august|september|october|november|december)/i);
  if (match2) {
    const day = parseInt(match2[1]);
    const month = months[match2[2].toLowerCase()];
    const result = `${defaultYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log('✅ Parsed without year (using', defaultYear, '):', result);
    return result;
  }

  // Pattern: "Jan 5" or "January 5"
  const match3 = dateStr.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|feburary|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i);
  if (match3) {
    const month = months[match3[1].toLowerCase()];
    const day = parseInt(match3[2]);
    const result = `${defaultYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log('✅ Parsed month-first format:', result);
    return result;
  }

  console.log('❌ Could not parse date:', dateStr);
  return null;
}

/**
 * Export all advanced tools
 */
export const advancedToolBelt = {
  advanced_query,
  delete_by_date,
  get_statistics,
  bulk_update,
};

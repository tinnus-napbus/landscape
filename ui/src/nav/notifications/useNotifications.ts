import { useMemo, useRef } from 'react';
import { useBundles, useBundlesRead } from '@/state/hark';
import _ from 'lodash';
import { Bundles, Origin, Notification } from '@/gear'
import { makePrettyDay } from '@/logic/utils';

export interface DayGrouping {
  date: string;
  notifications: GroupingNotification[];
}

export interface GroupingNotification {
    firstNotification: Notification;
    origin: Origin;
    isUnread: boolean;
    allNotifications: Notification[];
    count: number;
    day: string;
}

export function oldestInGrouping(groupings: DayGrouping[]): number | null {
  if (!groupings || groupings.length === 0) {
    return null;
  }
  
  let oldestTime = Number.MAX_SAFE_INTEGER;
  let foundValidTime = false;
  
  for (const grouping of groupings) {
    for (const item of grouping.notifications) {
      for (const notification of item.allNotifications) {
        let notificationTime: number | null = null;
        
        if (notification.time) {
          // Handle both string and number timestamp formats
          notificationTime = typeof notification.time === 'string' 
            ? (notification.time.includes('T') 
                ? new Date(notification.time).getTime() 
                : Number(notification.time))
            : Number(notification.time);
        }
        
        if (notificationTime && !isNaN(notificationTime) && notificationTime < oldestTime) {
          oldestTime = notificationTime;
          foundValidTime = true;
        }
      }
    }
  }
  
  return foundValidTime ? oldestTime : null;
}


export function groupBundlesByDate({bundles, isUnread}: {bundles: Bundles, isUnread: boolean}): DayGrouping[] {

  if (!bundles || bundles.length === 0) {
    return [];
  }
  
  // Create transformed bundles while preserving origin grouping but splitting by date
  let transformedBundles: GroupingNotification[] = []; 
  
  bundles.forEach(bundleWithOrigin => {
    if (bundleWithOrigin.bundle.length === 0) {
      return;
    }
    
    // Group this origin's notifications by date
    const notificationsByDay = _.groupBy(bundleWithOrigin.bundle, bundle => {
      const time = bundle.notification.time || 0;
      const date = new Date(time);
      return makePrettyDay(date);
    });
    
    // For each day, create a separate bundle entry but preserve origin
    Object.entries(notificationsByDay).forEach(([day, dayBundles]) => {
      // Sort the day's bundles by time (newest first)
      const sortedDayBundles = _.sortBy(dayBundles, bundle => 
        -(bundle.notification.time || 0)
      );
      
      // Use the newest notification as the first notification
      const firstBundle = sortedDayBundles[0];
      const allNotifications = sortedDayBundles.map(b => b.notification);
      
      transformedBundles.push({
        firstNotification: firstBundle.notification,
        isUnread,
        allNotifications,
        count: dayBundles.length,
        origin: bundleWithOrigin.origin,
        day
      });
    });
  });

  // Group by date
  const groupedByDate = _.groupBy(transformedBundles, item => item.day);

  const groupings = Object.entries(groupedByDate).map(([date, notifications]) => {
    return {
      date,
      notifications: notifications.sort((a, b) => {
        const timeA = a.firstNotification.time || 0;
        const timeB = b.firstNotification.time || 0;
        return timeB - timeA; // Sort descending (newest first)
      })
    };
  });

  return sortGroupingsByDate(groupings);
}

// Extract the date sorting logic for reuse
function sortGroupingsByDate(groupings: DayGrouping[]): DayGrouping[] {
  // Helper function to get numeric value for date strings for comparison
  const getDateValue = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    // Handle "Today"
    if (dateString.toLowerCase() === 'today') {
      return today.getTime();
    }
    
    // Handle "Yesterday" 
    if (dateString.toLowerCase() === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday.getTime();
    }
    
    // Handle "Month Day" format (like "March 12th")
    const monthDayMatch = dateString.match(/^([A-Za-z]+)\s+(\d+)(st|nd|rd|th)?$/);
    if (monthDayMatch) {
      const monthName = monthDayMatch[1];
      const day = parseInt(monthDayMatch[2], 10);
      
      // Get current year (assume recent dates)
      const year = today.getFullYear();
      
      // Convert month name to month number (0-11)
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      const monthIndex = months.findIndex(m => 
        m.toLowerCase() === monthName.toLowerCase()
      );
      
      if (monthIndex !== -1) {
        const date = new Date(year, monthIndex, day);
        
        // If this date is in the future, it's probably from last year
        if (date > today) {
          date.setFullYear(year - 1);
        }
        
        return date.getTime();
      }
    }
    
    // Fallback: Try to parse as regular date
    const fallbackDate = new Date(dateString);
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate.getTime();
    }
    
    // If all else fails, return a very old date to sort it at the end
    return 0;
  };

  // Sort groupings by date (newest first)
  return groupings.sort((a, b) => {
    const valueA = getDateValue(a.date);
    const valueB = getDateValue(b.date);
    return valueB - valueA;
  });
}


export function organizeGroupings(groupings: DayGrouping[]): DayGrouping[] {
  // Create a map to store combined results by date
  const groupingsByDate = new Map<string, DayGrouping>();
  
  // Process all groupings
  groupings.forEach(grouping => {
    if (groupingsByDate.has(grouping.date)) {
      const existing = groupingsByDate.get(grouping.date)!;
      existing.notifications = [...existing.notifications, ...grouping.notifications];
    } else {
      groupingsByDate.set(grouping.date, {
        date: grouping.date,
        notifications: [...grouping.notifications]
      });
    }
  });
  
  // Convert map back to array
  const organizedGroupings = Array.from(groupingsByDate.values());
  
  // Sort notifications within each grouping by time (newest first)
  organizedGroupings.forEach(grouping => {
    grouping.notifications.sort((a, b) => {
      const timeA = a.firstNotification.time || 0;
      const timeB = b.firstNotification.time || 0;
      return timeB - timeA;
    });
  });
  
  // Use the shared sortGroupingsByDate function for date sorting
  return sortGroupingsByDate(organizedGroupings);
}


export function countNotifications(bundles: Bundles): number {
  if (!bundles) {
    return 0;
  }
  
  return bundles.reduce((total, bundleItem) => {
    return total + (bundleItem.bundle?.length || 0);
  }, 0);
}


export const isMention = (notification: Notification) =>
  notification.contents.some((con) => con === ' mentioned you :');

export const isComment = (notification: Notification) =>
  notification.contents.some((con) => con === ' commented on ');

export const isReply = (notification: Notification) =>
  notification.contents.some((con) => con === ' replied to your message “');

export const isDM = (origin: Origin) => origin.path.startsWith('/dm');

export const isClub = (origin: Origin) => origin.path.startsWith('/club');

export const isGroups = (origin: Origin) => origin.desk === 'groups';

export function countGroupingNotifications(grouping: DayGrouping) {
  let count = 0;
  grouping.notifications.forEach((notification) => {
    count = count + notification.count;
  });
  return count;
}

export const useNotifications = () => {
  const {newBundles: newBundles, status: bundleStatus} = useBundles()

  return useMemo(() => {
    if (bundleStatus !== 'success') {
      return {
        new: [],
        countNew: 0,
        loaded: bundleStatus === 'error',
      };
    }



    const groupedNewNotifications = newBundles ? groupBundlesByDate({bundles: newBundles, isUnread: true}) : [];

    return {
      new: groupedNewNotifications,
      countNew: newBundles ? countNotifications(newBundles) : 0,
      loaded: bundleStatus === 'success' || bundleStatus === 'error',
    };
  }, [newBundles, bundleStatus]);
};

export const useReadNotifications = (date: string) => {
  // Skip processing if no valid date
  if (!date || date === '') {
    return {
      read: [],
      count: 0,
      loaded: 'error',
    };
  }

  // Force the date to be a direct value
  const actualDate = String(date);
  console.log('fetching bundles at:', actualDate)
  
  // Call useBundlesRead with query option to not refetch unnecessarily
  const {read: readBundles, status: bundleStatus} = useBundlesRead(actualDate);

  
  // Process results without memoization
  // This code will run on every render, but the actual API call is controlled by React Query
  if (bundleStatus !== 'success') {
    return {
      read: [],
      count: 0,
      loaded: bundleStatus === 'error' ? 'error' : false
    };
  }
  const totalNotifications = readBundles ? countNotifications(readBundles) : 0;
  const groupedReadNotifications = readBundles ? 
    groupBundlesByDate({bundles: readBundles, isUnread: false}) : [];
  
  return {
    read: groupedReadNotifications,
    count: totalNotifications,
    loaded: true
  };
};
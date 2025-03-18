import { useMemo, useRef } from 'react';
import { useBundles, useBundlesRead } from '@/state/ding';
import { useMemo, useRef } from 'react';
import { useBundles, useBundlesRead } from '@/state/ding';
import _ from 'lodash';
import { Bundles, Origin, Notification as DingNotification } from '@/gear'
import { Bundles, Origin, Notification as DingNotification } from '@/gear'
import { makePrettyDay } from '@/logic/utils';

export interface DayGrouping {
  date: string;
  latest: number;
}

export interface DingDayGrouping {
  date: string;
  notifications: DingGroupingNotification[];
}

export interface DingGroupingNotification {
  notifications: DingGroupingNotification[];
}

export interface DingGroupingNotification {
    firstNotification: DingNotification;
    origin: Origin;
    isUnread: boolean;
    origin: Origin;
    isUnread: boolean;
    allNotifications: DingNotification[];
    count: number;
    day: string;
    day: string;
}

export function oldestInGrouping(groupings: DingDayGrouping[]): number | null {
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
export function oldestInGrouping(groupings: DingDayGrouping[]): number | null {
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
  
  console.log('Found oldest time:', foundValidTime ? oldestTime : 'none');
  return foundValidTime ? oldestTime : null;
}

export function groupBundlesByDate({bundles, isUnread}: {bundles: Bundles, isUnread: boolean}): DingDayGrouping[] {

  if (!bundles || bundles.length === 0) {
  console.log('Found oldest time:', foundValidTime ? oldestTime : 'none');
  return foundValidTime ? oldestTime : null;
}

export function groupBundlesByDate({bundles, isUnread}: {bundles: Bundles, isUnread: boolean}): DingDayGrouping[] {

  if (!bundles || bundles.length === 0) {
    return [];
  }
  
  // Create transformed bundles while preserving origin grouping but splitting by date
  let transformedBundles: DingGroupingNotification[] = []; 
  
  bundles.forEach(bundleWithOrigin => {
  // Create transformed bundles while preserving origin grouping but splitting by date
  let transformedBundles: DingGroupingNotification[] = []; 
  
  bundles.forEach(bundleWithOrigin => {
    if (bundleWithOrigin.bundle.length === 0) {
      return;
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
      console.log('day', day)
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

function sortGroupingsByDate(groupings: DingDayGrouping[]): DingDayGrouping[] {

  const getDateValue = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateString.toLowerCase() === 'today') {
      return today.getTime();
    }
    
    if (dateString.toLowerCase() === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday.getTime();
    }
    
    const monthDayMatch = dateString.match(/^([A-Za-z]+)\s+(\d+)(st|nd|rd|th)?$/);
    if (monthDayMatch) {
      const monthName = monthDayMatch[1];
      const day = parseInt(monthDayMatch[2], 10);
      
      const year = today.getFullYear();
      
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      const monthIndex = months.findIndex(m => 
        m.toLowerCase() === monthName.toLowerCase()
      );
      
      if (monthIndex !== -1) {
        const date = new Date(year, monthIndex, day);
        
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

    return 0;
  };

  return groupings.sort((a, b) => {
    const valueA = getDateValue(a.date);
    const valueB = getDateValue(b.date);
    return valueB - valueA;
  });
}


export function organizeGroupings(groupings: DingDayGrouping[]): DingDayGrouping[] {
  // Create a map to store combined results by date
  const groupingsByDate = new Map<string, DingDayGrouping>();
  
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
  
  return sortGroupingsByDate(organizedGroupings);
    // Group this origin's notifications by date
    const notificationsByDay = _.groupBy(bundleWithOrigin.bundle, bundle => {
      const time = bundle.notification.time || 0;
      const date = new Date(time);
      return makePrettyDay(date);
    });
    
    // For each day, create a separate bundle entry but preserve origin
    Object.entries(notificationsByDay).forEach(([day, dayBundles]) => {
      console.log('day', day)
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

function sortGroupingsByDate(groupings: DingDayGrouping[]): DingDayGrouping[] {

  const getDateValue = (dateString: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateString.toLowerCase() === 'today') {
      return today.getTime();
    }
    
    if (dateString.toLowerCase() === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday.getTime();
    }
    
    const monthDayMatch = dateString.match(/^([A-Za-z]+)\s+(\d+)(st|nd|rd|th)?$/);
    if (monthDayMatch) {
      const monthName = monthDayMatch[1];
      const day = parseInt(monthDayMatch[2], 10);
      
      const year = today.getFullYear();
      
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
      ];
      
      const monthIndex = months.findIndex(m => 
        m.toLowerCase() === monthName.toLowerCase()
      );
      
      if (monthIndex !== -1) {
        const date = new Date(year, monthIndex, day);
        
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

    return 0;
  };

  return groupings.sort((a, b) => {
    const valueA = getDateValue(a.date);
    const valueB = getDateValue(b.date);
    return valueB - valueA;
  });
}


export function organizeGroupings(groupings: DingDayGrouping[]): DingDayGrouping[] {
  // Create a map to store combined results by date
  const groupingsByDate = new Map<string, DingDayGrouping>();
  
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
  
  return sortGroupingsByDate(organizedGroupings);
}


export function countNotifications(bundles: Bundles): number {

export function countNotifications(bundles: Bundles): number {
  if (!bundles) {
    return 0;
  }
  
  return bundles.reduce((total, bundleItem) => {
  
  return bundles.reduce((total, bundleItem) => {
    return total + (bundleItem.bundle?.length || 0);
  }, 0);
}


export const isMention = (notification: DingNotification) =>
  notification.contents.some((con) => con === ' mentioned you :');
export const isMention = (notification: DingNotification) =>
  notification.contents.some((con) => con === ' mentioned you :');

export const isComment = (notification: DingNotification) =>
  notification.contents.some((con) => con === ' commented on ');
export const isComment = (notification: DingNotification) =>
  notification.contents.some((con) => con === ' commented on ');

export const isReply = (notification: DingNotification) =>
  notification.contents.some((con) => con === ' replied to your message “');
export const isReply = (notification: DingNotification) =>
  notification.contents.some((con) => con === ' replied to your message “');

export const isDM = (origin: Origin) => origin.path.startsWith('/dm');
export const isDM = (origin: Origin) => origin.path.startsWith('/dm');

export const isClub = (origin: Origin) => origin.path.startsWith('/club');
export const isClub = (origin: Origin) => origin.path.startsWith('/club');

export const isGroups = (origin: Origin) => origin.desk === 'groups';
export const isGroups = (origin: Origin) => origin.desk === 'groups';

export function countGroupingNotifications(grouping: DingDayGrouping) {
  let count = 0;
  grouping.notifications.forEach((notification) => {
    count = count + notification.count;
  });
  return count;
}

export const useNotifications = () => {
  const {newBundles: newBundles, status: bundleStatus} = useBundles()
export function countGroupingNotifications(grouping: DingDayGrouping) {
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
        new: [],
        countNew: 0,
        loaded: bundleStatus === 'error',
      };
    }


    const groupedNewNotifications = newBundles ? groupBundlesByDate({bundles: newBundles, isUnread: true}) : [];

    const groupedNewNotifications = newBundles ? groupBundlesByDate({bundles: newBundles, isUnread: true}) : [];

    return {
      new: groupedNewNotifications,
      countNew: newBundles ? countNotifications(newBundles) : 0,
      new: groupedNewNotifications,
      countNew: newBundles ? countNotifications(newBundles) : 0,
      loaded: bundleStatus === 'success' || bundleStatus === 'error',
    };
  }, [newBundles, bundleStatus]);
};

export const useReadNotifications = (date: string) => {
  // Use ref to track the last date we've processed
  const lastDateRef = useRef('');
  
  // Early bailout if date hasn't changed
  if (lastDateRef.current === date) {
  } else {
    lastDateRef.current = date;
  }
  
  if (!date || date === '') {
    return {
      read: [],
      count: 0,
      loaded: 'error',
    };
  }

  const actualDate = String(date);
  
  const {read: readBundles, status: bundleStatus} = useBundlesRead(actualDate);
  

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
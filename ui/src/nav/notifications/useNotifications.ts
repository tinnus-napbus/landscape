<<<<<<< HEAD
import { useMemo, useRef } from 'react';
import { useBundles, useBundlesRead } from '@/state/hark';
import _ from 'lodash';
import { Bundles, Origin, Notification } from '@/gear'
=======
import { useMemo } from 'react';
import { useSkeins } from '@/state/hark';
import { useBundles } from '@/state/ding';
import _ from 'lodash';
import { Rope, Skein, Yarn } from '@/gear';
import { Bundles, BundleWithOrigin, Notification as DingNotification } from '@/gear'
>>>>>>> 9bf1795 (scry and subscribtion to /all in FE)
import { makePrettyDay } from '@/logic/utils';

export interface DayGrouping {
  date: string;
<<<<<<< HEAD
  notifications: GroupingNotification[];
=======
  latest: number;
}

export interface DingDayGrouping {
  date: string;
  latest: number;
  notifications: {
    bundleWithOrigin: BundleWithOrigin;
    firstNotification: DingNotification;
    time: string;
    allNotifications: DingNotification[];
    count: number;
  }[];
>>>>>>> 9bf1795 (scry and subscribtion to /all in FE)
}

export interface GroupingNotification {
    firstNotification: Notification;
    origin: Origin;
    isUnread: boolean;
    allNotifications: Notification[];
    count: number;
    day: string;
    day: string;
}

<<<<<<< HEAD
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
  
  console.log('Found oldest time:', foundValidTime ? oldestTime : 'none');
  return foundValidTime ? oldestTime : null;
}
=======
function groupBundlesByDate(bundles: Bundles): DingDayGrouping[] {
  if (!bundles) {
    return [];
  }
  
  const bundlesArray = Array.isArray(bundles) ? bundles : 
    (bundles && typeof bundles === 'object' && 'bundles' in bundles && Array.isArray(bundles.bundles)) ? 
    bundles.bundles : [];
  
  if (bundlesArray.length === 0) {
    return [];
  }
  
  const transformedBundles = bundlesArray.map(bundleWithOrigin => {
    if (bundleWithOrigin.bundle.length === 0) {
      return null;
    }
    
    // First bundle notification
    const firstBundle = bundleWithOrigin.bundle[0];
    
    let validTime = firstBundle.time;
    try {
      const testDate = new Date(validTime);
      if (isNaN(testDate.getTime())) {
        validTime = new Date().toISOString();
      }
    } catch (error) {
      validTime = new Date().toISOString();
    }
    
    // Keep all notifications for this origin
    const allNotifications = bundleWithOrigin.bundle.map(b => b.notification);
    
    return {
      bundleWithOrigin,
      firstNotification: firstBundle.notification,
      time: validTime,
      allNotifications,
      count: bundleWithOrigin.bundle.length
    };
  }).filter(Boolean);

  const groups = _.groupBy(transformedBundles, item => {
    try {
      if (!item.time) {
        return 'Unknown Date';
      }
      
      const date = new Date(item.time);
      if (isNaN(date.getTime())) {
        return 'Unknown Date';
      }
      
      return makePrettyDay(date);
    } catch (error) {
      console.error('Error grouping by date:', error);
      return 'Unknown Date';
    }
  });

  return Object.entries(groups)
    .map(([k, v]) => {
      const firstItem = _.head(v);
      const latestTime = firstItem?.time ? new Date(firstItem.time).getTime() : 0;
      
      return {
        date: k,
        latest: isNaN(latestTime) ? 0 : latestTime,
        notifications: v.sort((a, b) => {
          // Safely get timestamps for sorting
          const timeA = a.time ? new Date(a.time).getTime() : 0;
          const timeB = b.time ? new Date(b.time).getTime() : 0;
          
          return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
        }),
      };
    })
    .sort((a, b) => b.latest - a.latest);
}

function countNotifications(bundles: Bundles): number {
  if (!bundles) {
    return 0;
  }

  const bundlesArray = Array.isArray(bundles) ? bundles : 
    (bundles && typeof bundles === 'object' && 'bundles' in bundles && Array.isArray(bundles.bundles)) ? 
    bundles.bundles : [];
  
  return bundlesArray.reduce((total, bundleItem) => {
    return total + (bundleItem.bundle?.length || 0);
  }, 0);
}


export const isMention = (yarn: Yarn) =>
  yarn.con.some((con) => con === ' mentioned you :');
>>>>>>> 9bf1795 (scry and subscribtion to /all in FE)


export function groupBundlesByDate({bundles, isUnread}: {bundles: Bundles, isUnread: boolean}): DayGrouping[] {
  console.log('bundles', bundles);

  if (!bundles || bundles.length === 0) {
    return [];
  }
  
  // Create transformed bundles while preserving origin grouping but splitting by date
  let transformedBundles: GroupingNotification[] = []; 
  
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

<<<<<<< HEAD
  return sortGroupingsByDate(groupings);
}

function sortGroupingsByDate(groupings: DayGrouping[]): DayGrouping[] {

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
  
  return sortGroupingsByDate(organizedGroupings);
}


export function countNotifications(bundles: Bundles): number {
  if (!bundles) {
    return 0;
  }
  
  return bundles.reduce((total, bundleItem) => {
  
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
export const isDM = (origin: Origin) => origin.path.startsWith('/dm');

export const isClub = (origin: Origin) => origin.path.startsWith('/club');
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
=======
export const useNotifications = (mentionsOnly = false) => {
  const {data: bundles, status: bundleStatus} = useBundles()
>>>>>>> 9bf1795 (scry and subscribtion to /all in FE)

  return useMemo(() => {
    if (bundleStatus !== 'success') {
      return {
<<<<<<< HEAD
        new: [],
        countNew: 0,
        new: [],
        countNew: 0,
=======
        notifications: [],
        mentions: [],
        count: 0,
>>>>>>> 9bf1795 (scry and subscribtion to /all in FE)
        loaded: bundleStatus === 'error',
      };
    }

<<<<<<< HEAD

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
=======
    const totalNotifications = bundles ? countNotifications(bundles) : 0;
    const groupedNotifications = bundles ? groupBundlesByDate(bundles) : [];

    return {
      notifications: groupedNotifications,
      mentions: null,
      count: totalNotifications,
      loaded: bundleStatus === 'success' || bundleStatus === 'error',
    };
  }, [bundles, mentionsOnly, bundleStatus]);
>>>>>>> 9bf1795 (scry and subscribtion to /all in FE)
};

export const useReadNotifications = (date: string) => {
  // Use ref to track the last date we've processed
  const lastDateRef = useRef('');
  
  // Early bailout if date hasn't changed
  if (lastDateRef.current === date) {
  } else {
    lastDateRef.current = date;
  }
  
  // Skip processing if no valid date
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
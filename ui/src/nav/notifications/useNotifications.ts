import { useMemo } from 'react';
import { useSkeins } from '@/state/hark';
import { useBundles } from '@/state/ding';
import _ from 'lodash';
import { Rope, Skein, Yarn } from '@/gear';
import { Bundles, BundleWithOrigin, Notification as DingNotification } from '@/gear'
import { makePrettyDay } from '@/logic/utils';

export interface DayGrouping {
  date: string;
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
}

function groupSkeinsByDate(skeins: Skein[]): DayGrouping[] {
  const groups = _.groupBy(skeins, (b) => makePrettyDay(new Date(b.time)));

  return Object.entries(groups)
    .map(([k, v]) => ({
      date: k,
      latest: _.head(v)?.time || 0,
      skeins: v.sort((a, b) => b.time - a.time),
    }))
    .sort((a, b) => b.latest - a.latest);
}

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

export const isComment = (yarn: Yarn) =>
  yarn.con.some((con) => con === ' commented on ');

export const isReply = (yarn: Yarn) =>
  yarn.con.some((con) => con === ' replied to your message “');

export const isDM = (rope: Rope) => rope.thread.startsWith('/dm');

export const isClub = (rope: Rope) => rope.thread.startsWith('/club');

export const isGroups = (rope: Rope) => rope.desk === 'groups';

export const useNotifications = (mentionsOnly = false) => {
  const {data: bundles, status: bundleStatus} = useBundles()

  return useMemo(() => {
    if (bundleStatus !== 'success') {
      return {
        notifications: [],
        mentions: [],
        count: 0,
        loaded: bundleStatus === 'error',
      };
    }

    const totalNotifications = bundles ? countNotifications(bundles) : 0;
    const groupedNotifications = bundles ? groupBundlesByDate(bundles) : [];

    return {
      notifications: groupedNotifications,
      mentions: null,
      count: totalNotifications,
      loaded: bundleStatus === 'success' || bundleStatus === 'error',
    };
  }, [bundles, mentionsOnly, bundleStatus]);
};

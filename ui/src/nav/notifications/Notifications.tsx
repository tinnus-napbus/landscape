import cn from 'classnames';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../../components/ErrorAlert';
import { useGroups } from './groups';
import NotificationItem from './Notification';
import { useNotifications, useReadNotifications, oldestInGrouping, DayGrouping, organizeGroupings } from './useNotifications';
import { useReadAll } from '@/state/hark';
import { Spinner } from '@/components/Spinner';
import { useIsMobile } from '@/logic/useMedia';
import { randomIntInRange } from '@/logic/utils';

interface MarkAsReadProps {
  unreads: boolean;
}

function MarkAsRead({ unreads }: MarkAsReadProps) {
  const isMobile = useIsMobile();
  const { mutate: readAll, isLoading } = useReadAll();
  const { mutate: readAll, isLoading } = useReadAll();
  const markAllRead = useCallback(() => {
    readAll();
  }, [readAll]);
    readAll();
  }, [readAll]);

  return (
    <button
      disabled={isLoading || !unreads}
      className={cn(
        'whitespace-nowrap text-sm',
        isMobile ? 'small-button' : 'button',
        {
          'bg-gray-400 text-gray-800': isLoading || !unreads,
          'bg-blue text-white': !isLoading && unreads,
        }
      )}
      onClick={markAllRead}
    >
      {isLoading ? <Spinner className="h-4 w-4" /> : 'Mark All Read'}
    </button>
  );
}

function NotificationPlaceholder() {
  const isMobile = useIsMobile();
  return (
    <div className="flex w-full animate-pulse flex-col rounded-lg">
      <div className="flex w-full flex-1 space-x-3 rounded-lg p-2">
        <div className="flex h-6 w-24 justify-center rounded-md bg-gray-100 text-sm" />
      </div>
      <div className="flex w-full flex-1 space-x-3 rounded-lg p-2">
        <div
          className="h-12 w-full rounded-md bg-gray-200"
          style={{
            width: `${randomIntInRange(300, isMobile ? 300 : 900)}px`,
          }}
        />
      </div>
    </div>
  );
}

export const Notifications = React.memo(() => {
export const Notifications = React.memo(() => {
  const navigate = useNavigate();
  const groups = useGroups();
  const { new: newBundles, countNew, loaded } = useNotifications();
  
  const readNotificationsRef = useRef<DayGrouping[]>([]) 
  const [oldestNote, setOldest] = useState('~')
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  
  // Use the ref value to avoid re-rendering due to state changes
  const { read, count: countRead, loaded: readLoaded } = useReadNotifications(oldestNote);

  useEffect(() => {
    console.log('useEffect initial render', read, countRead, read !== readNotificationsRef.current)
    if (oldestNote === '~' && countRead > 0 && read !== readNotificationsRef.current) {
      console.log('Initial load, setting notifications:', read);
      readNotificationsRef.current = read;
      setHasMore(countRead >= 30);
    }

  }, [read, countRead]);
  
  // Create refs last, consistently
  const lastNotificationRef = useRef<HTMLLIElement | null>(null);

  // Keep track of processed data to avoid infinite loops
  //const processedDataRef = useRef(new Set());
  
  // Use a stateful variable to detect changes in the read data
  const readDataRef = useRef<DayGrouping[]>([]);
  
  // Handle additional data loading after getting data for pagination
  useEffect(() => {
    console.log('loadingMore useEffect', read, loadingMore, pageNum)
    // Don't run if not loading more or no data
    if (!loadingMore || pageNum === 0) {
      return;
    }
    
    // Create a stable identifier for this data batch
    console.log('alredy in read?', read === readDataRef.current)
    // Skip if we haven't gotten new data since last time
    if (read === readDataRef.current) {
      return;
    }
    
    // Store this data to avoid reprocessing
    readDataRef.current = read;
    
    console.log('New data received for page:', pageNum);
    
    if (read && read.length > 0) {
      // Safely update with functional update to avoid stale data
      const prev = readNotificationsRef.current;
      //setAllReadNotifications(prev => {
        // Get existing notification IDs to avoid duplicates
        const existingIds = new Set();
        prev.forEach(group => {
          group.notifications.forEach(item => {
            item.allNotifications.forEach(n => {
              existingIds.add(n.id);
            });
          });
        });
        
        // Check for any new IDs
        let hasNewItems = false;

        read.forEach(group => {
          group.notifications.forEach(bundle => {
            bundle.allNotifications.forEach(note =>{
              if (!existingIds.has(note.id)) {
                hasNewItems = true;
              }
            })
          });
        });
        
        if (hasNewItems) {
          // console.log('Adding new notifications to list');
          // console.log([...prev, ...read])
          const grouped = organizeGroupings([...prev, ...read])
          console.log('organizedGroupings', grouped)
          readNotificationsRef.current = grouped;
        } else {
          console.log('No new notifications found');
          //readNotificationsRef.current = prev;
        }
      
      // Update load more flag based on count
      setHasMore(countRead >= 30);
    } else {
      // No more notifications
      setHasMore(false);
    }
    
    // Always clear loading state
    setLoadingMore(false);
  }, [loadingMore, pageNum]);

  // Function to load more notifications
  const loadMoreNotifications = useCallback(() => {
    console.log('loadMore notifications', hasMore && !loadingMore && readNotificationsRef.current.length > 0)
    if (hasMore && !loadingMore && readNotificationsRef.current.length > 0) {
      const oldest = oldestInGrouping(readNotificationsRef.current);
      
      if (oldest) {
        console.log('Loading more with oldest timestamp:', oldest);
        
        // Get the oldest timestamp for the next batch
        //const timestampStr = oldest.toString();
        
        // Update ref with new timestamp
        setOldest(oldest.toString())
        //oldestDateRef.current = timestampStr;
        
        // Update state to trigger data loading
        setPageNum(prev => prev + 1);
        console.log('pageNum', pageNum)
        setLoadingMore(true);
      }
    }
  }, [hasMore, loadingMore, readNotificationsRef.current]);

  // Intersection Observer to detect when we've scrolled to the bottom
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const [entry] = entries;
  //       if (entry.isIntersecting && hasMore && !loadingMore) {
  //         console.log('loading more')
  //         loadMoreNotifications();
  //       }
  //     },
  //     { threshold: 0.5 }
  //   );

  //   const currentRef = lastNotificationRef.current;
  //   if (currentRef) {
  //     observer.observe(currentRef);
  //   }

  //   return () => {
  //     if (currentRef) {
  //       observer.unobserve(currentRef);
  //     }
  //   };
  // }, [hasMore, loadingMore, lastNotificationRef.current]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loadingMore) {
          loadMoreNotifications();
        }
      },
      { threshold: 0.5 }
    );
  
    const currentRef = lastNotificationRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
  
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore]); // Only trigger when hasMore or loadingMore changes
  


  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => navigate('/leap/notifications')}
    >
      <div className="h-full overflow-y-scroll p-4 pr-2 md:p-9 md:pr-7">
        <div className="mb-4 flex w-full items-center justify-between">
          <h2 className="text-xl font-semibold">All Notifications</h2>
          <MarkAsRead unreads={countNew > 0} />
          <MarkAsRead unreads={countNew > 0} />
        </div>
        <section className="w-full">
          {loaded ? (
            countNew + countRead === 0 ? (
            countNew + countRead === 0 ? (
              <div className="mt-3 flex w-full items-center justify-center">
                <span className="text-base font-semibold text-gray-400">
                  No notifications
                </span>
              </div>
            ) : ( 
              <>
              {countNew > 0 && 
                (newBundles?.map((grouping, index) => (
                  <div
            ) : ( 
              <>
              {countNew > 0 && 
                (newBundles?.map((grouping, index) => (
                  <div
                  className="mb-4 rounded-xl bg-gray-50 p-4"
                  key={index}
                  key={index}
                >
                  <h2 className="mb-4 text-lg font-bold text-gray-400">
                    {grouping.date}
                  </h2>
                  <ul className="space-y-2">
                    {grouping.notifications.map((item) => {
                      const isLastItem = index === grouping.notifications.length - 1 && 
                      index === countRead
                      const isLastItem = index === grouping.notifications.length - 1 && 
                      index === countRead
                      return(
                      <li key={item.firstNotification.id}
                          ref={isLastItem ? lastNotificationRef : null}
                          className="bg-blue-50 rounded-xl"
                      >
                      <li key={item.firstNotification.id}
                          ref={isLastItem ? lastNotificationRef : null}
                          className="bg-blue-50 rounded-xl"
                      >
                        <NotificationItem
                          firstNotification={item.firstNotification}
                          isUnread={item.isUnread}
                          allNotifications={item.allNotifications}
                          count={item.count}
                          groups={groups}
                        />
                      </li>
                      )}
                    )}
                  </ul>
                </div>
                ))
              )}
              {countRead > 0 && 
              (readNotificationsRef.current?.map((grouping, index) => (
                <div
                className="mb-4 rounded-xl bg-gray-50 p-4"
                key={index}
              >
                <h2 className="mb-4 text-lg font-bold text-gray-400">
                  {grouping.date}
                </h2>
                <ul className="space-y-2">
                  {grouping.notifications.map((item) => {
                    const isLastItem = index === readNotificationsRef.current.length - 1 && 
                    grouping.notifications.indexOf(item) === grouping.notifications.length - 1
                    return(
                    <li key={item.firstNotification.id}
                        ref={isLastItem ? lastNotificationRef : null}
                        className="bg-white rounded-xl"
                    >
                      <NotificationItem 
                        firstNotification={item.firstNotification}
                        isUnread={item.isUnread}
                        allNotifications={item.allNotifications}
                        count={item.count}
                        groups={groups}
                      />
                    </li>
                    )}
                  )}
                </ul>
              </div>
              ))
            )}
            </>
          )) : (
                ))
              )}
              {countRead > 0 && 
              (readNotificationsRef.current?.map((grouping, index) => (
                <div
                className="mb-4 rounded-xl bg-gray-50 p-4"
                key={index}
              >
                <h2 className="mb-4 text-lg font-bold text-gray-400">
                  {grouping.date}
                </h2>
                <ul className="space-y-2">
                  {grouping.notifications.map((item) => {
                    const isLastItem = index === readNotificationsRef.current.length - 1 && 
                    grouping.notifications.indexOf(item) === grouping.notifications.length - 1
                    return(
                    <li key={item.firstNotification.id}
                        ref={isLastItem ? lastNotificationRef : null}
                        className="bg-white rounded-xl"
                    >
                      <NotificationItem 
                        firstNotification={item.firstNotification}
                        isUnread={item.isUnread}
                        allNotifications={item.allNotifications}
                        count={item.count}
                        groups={groups}
                      />
                    </li>
                    )}
                  )}
                </ul>
              </div>
              ))
            )}
            </>
          )) : (
            new Array(15)
              .fill(true)
              .map((_, i) => <NotificationPlaceholder key={i} />)
          )}
        </section>
        {loadingMore && (
          <div className="flex justify-center items-center p-4">
            <Spinner className="h-6 w-6" />
          </div>
        )}
        {loadingMore && (
          <div className="flex justify-center items-center p-4">
            <Spinner className="h-6 w-6" />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
});
});

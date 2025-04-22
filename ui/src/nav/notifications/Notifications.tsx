import cn from 'classnames';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorAlert } from '../../components/ErrorAlert';
import { useGroups } from './groups';
import NotificationItem from './Notification';
import { useNotifications, useReadNotifications, oldestInGrouping, DayGrouping, organizeGroupings, groupBundlesByDate } from './useNotifications';
import { useReadAll } from '@/state/hark';
import { Spinner } from '@/components/Spinner';
import { useIsMobile } from '@/logic/useMedia';
import { randomIntInRange } from '@/logic/utils';
import { Bundles } from '@/gear';

interface MarkAsReadProps {
  unreads: boolean;
}

function MarkAsRead({ unreads }: MarkAsReadProps) {
  const isMobile = useIsMobile();
  const { mutate: readAll, isLoading } = useReadAll();
  const markAllRead = useCallback(() => {
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const groups = useGroups();
  const { new: newBundles, countNew, loaded } = useNotifications();
  
  const readNotificationsRef = useRef<DayGrouping[]>([])

  const [oldestNote, setOldestNote] = useState('~')
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  
  // Use the ref value to avoid re-rendering due to state changes
  const { read, count: countRead, loaded: readLoaded } = useReadNotifications(oldestNote);

  useEffect(() => {
    queryClient.removeQueries({
      predicate: (query) => {
        return Array.isArray(query.queryKey) && 
              query.queryKey[0] === 'bundles-read';
      }
    });
  }, []);


  useEffect(() => {
    if (oldestNote === '~' && countRead > 0 && read.length > 0) {
      readNotificationsRef.current = [...read];
      setHasMore(countRead === 50);
    }

  }, [read, countRead, oldestNote]);
  
  // Create refs last, consistently
  const lastNotificationRef = useRef<HTMLLIElement | null>(null);
  const readDataRef = useRef<DayGrouping[]>([]);
  const refreshedQueryRef = useRef<string[]>([])
  
  // Handle additional data loading after getting data for pagination
  useEffect(() => {
  const isPaginationData = oldestNote !== '~';
  
  // Always process data when we have it, regardless of loading state
  // This ensures we capture data from both loadMore and cache invalidation
  if (read?.length === 0) {
    if (hasMore && isPaginationData) {
      setLoadingMore(false);
      setHasMore(false);
    }
  }
  
  if (isPaginationData && refreshedQueryRef.current.length === 0) {
    
    // For pagination data, always merge with existing
    // Store the current notifications to merge with
    const prev = readNotificationsRef.current || [];
    
    const existingIds = new Set();
    prev.forEach(group => {
      group.notifications.forEach(item => {
        item.allNotifications.forEach(n => {
          existingIds.add(n.id);
        });
      });
    });

    let hasNewData = false;
    read.forEach(group => {
      group.notifications.forEach(item => {
        item.allNotifications.forEach(n => {
          if (!existingIds.has(n.id)) {
            hasNewData = true;
          }
        });
      });
    });
    
    if (hasNewData) {
      setLoadingMore(false)

      const merged = organizeGroupings([...prev, ...read]);
      
      // Store the merged result
      readNotificationsRef.current = merged;
      
      setHasMore(countRead === 50);
    } else {
    }
  } else if (oldestNote === '~') {
    // For initial data, replace existing data
    readDataRef.current = [...read];
    
    if (readNotificationsRef.current.length === 0) {
      readNotificationsRef.current = [...read];
    } else {
      const merged = organizeGroupings([...read]);
      readNotificationsRef.current = merged;
    }
    
    setHasMore(countRead === 50);
  } 
}, [loadingMore, pageNum, read, countRead, oldestNote, hasMore, refreshedQueryRef]);

  // Function to load more notifications
  const loadMoreNotifications = useCallback(() => {

    // Only proceed if we have more to load and we're not already loading
    if (!hasMore) {
      return;
    }
    
    if (loadingMore) {
      return;
    }
    
    if (readNotificationsRef.current.length === 0) {
      return;
    }

    // Get the oldest notification for the next batch
    const oldest = oldestInGrouping(readNotificationsRef.current);
    
    if (!oldest) {
      setHasMore(false);
      return;
    }

    // Set loading state and trigger fetch
    setLoadingMore(true);
    setPageNum(prev => prev + 1);
    setOldestNote(oldest.toString())
    
  }, [hasMore, loadingMore, readNotificationsRef.current.length]);

const isInLoadingCycleRef = React.useRef(false);

  // Listen for cache invalidation events
useEffect(() => {
  
  const unsubscribe = queryClient.getQueryCache().subscribe(event => {
    // The correct event types from React Query
    if (event.type === 'updated') {
      const queryKey = event.query.queryKey;
      
      if (Array.isArray(queryKey) && queryKey[0] === 'bundles-read-since') {
        if(queryKey[1] === '~'){
          queryClient.removeQueries({
            predicate: (query) => {
              return Array.isArray(query.queryKey) && 
                    query.queryKey[0] === 'bundles-read';
            }
          });
        }
          
        // Get bundle data from the event
        const readBundles = event.query.state.data && 'bundles' in event.query.state.data 
          ? event.query.state.data.bundles as Bundles 
          : [] as Bundles;
        
          
        isInLoadingCycleRef.current = true;
        const data = groupBundlesByDate({bundles: readBundles, isUnread: false});
        const merged = organizeGroupings([...data]);
        readNotificationsRef.current = merged;
        
        
        setLoadingMore(false);
        refreshedQueryRef.current = [];
        isInLoadingCycleRef.current = false;
      }
    }
  });
    
  return () => {
    // Clean up the subscription
    unsubscribe();
  };
}, [queryClient, oldestNote, loadingMore, refreshedQueryRef]);

const fetchMoreData = async () => {
  if (!hasMore || loadingMore) return Promise.resolve(); // Don't fetch if there's no more data or already loading
  
  try {
    loadMoreNotifications();
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error fetching more data:', error);
    return Promise.reject(error);
  }
};

useEffect(() => {
  // Setup infinite scroll
  const cleanup = setupInfiniteScroll(fetchMoreData);
  
  // Clean up when component unmounts
  return cleanup;
}, [hasMore, loadingMore]);

function setupInfiniteScroll(loadMoreFunction: () => Promise<any>) {
  const threshold = 200;
  let isLoading = false;
  
  const scrollContainer = document.querySelector('.h-full.overflow-y-scroll');
  
  if (!scrollContainer) {
    console.error('Scroll container not found');
    return () => {};
  }
  
  const checkIfShouldLoadMore = () => {
    // Calculate position
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;
    
    // If content doesn't fill the container or we're near the bottom
    if (!isLoading && (
      scrollHeight <= clientHeight || 
      scrollTop + clientHeight >= scrollHeight - threshold
    )) {
      isLoading = true;
      
      // Call your load more function
      loadMoreFunction()
        .then(() => {
          isLoading = false;
          
          setTimeout(() => {
            if (scrollHeight <= clientHeight) {
              checkIfShouldLoadMore();
            }
          }, 100);
        })
        .catch(error => {
          console.error('Error loading more content:', error);
          isLoading = false;
        });
    }
  };

  setTimeout(checkIfShouldLoadMore, 100);
  
  const handleScroll = () => checkIfShouldLoadMore();
  scrollContainer.addEventListener('scroll', handleScroll);
  
  // Return a cleanup function to remove the event listener
  return () => {
    scrollContainer.removeEventListener('scroll', handleScroll);
  };
}

  return (
    <ErrorBoundary
      FallbackComponent={ErrorAlert}
      onReset={() => navigate('/leap/notifications')}
    >
      <div className="h-full overflow-y-scroll p-4 pr-2 md:p-9 md:pr-7">
        <div className="mb-4 flex w-full items-center justify-between">
          <h2 className="text-xl font-semibold">All Notifications</h2>
          <MarkAsRead unreads={countNew > 0} />
        </div>
        <section className="w-full">
          {loaded ? (
            countNew + (readNotificationsRef.current?.length > 0 ? 1 : 0) === 0 ? (
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
                  className="mb-4 rounded-xl bg-gray-50 p-4"
                  key={index}
                >
                  <h2 className="mb-4 text-lg font-bold text-gray-400">
                    {grouping.date}
                  </h2>
                  <ul className="space-y-2">
                    {grouping.notifications.map((item) => {
                      const isLastItem = index === grouping.notifications.length - 1 && 
                      index === countRead
                      return(
                      <li key={item.firstNotification.id}
                          ref={isLastItem ? lastNotificationRef : null}
                          className="bg-blue-50 rounded-xl"
                      >
                        <NotificationItem
                          firstNotification={item.firstNotification}
                          isUnread={item.isUnread}
                          allNotifications={item.allNotifications}
                          count={item.allNotifications.length}
                          groups={groups}
                        />
                      </li>
                      )}
                    )}
                  </ul>
                </div>
                ))
              )}
              {readNotificationsRef.current?.length > 0 && 
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
      </div>
    </ErrorBoundary>
  );
});
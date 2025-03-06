import React, { useCallback, useState, useEffect } from 'react';
import cn from 'classnames';
import { format } from 'date-fns';
import _ from 'lodash';
import { Notification as DingNotification, BundleWithOrigin, Content, Origin } from '@/gear';
import { Groups } from './groups';
import { Avatar } from '../../components/Avatar';
import { ShipName } from '../../components/ShipName';
import { DeskLink } from '../../components/DeskLink';
import GroupAvatar from '../../components/GroupAvatar';
import { useGroups } from './groups';

interface DingNotificationProps {
  bundleWithOrigin: BundleWithOrigin;
  firstNotification: DingNotification;
  allNotifications: DingNotification[];
  count: number;
  groups: Groups | undefined;
}

function makePrettyTime(date: Date) {
  console.log('date', date)
  // Add validation to ensure we have a valid date
  if (!date || isNaN(date.getTime())) {
    return '--:--'; // Return placeholder if date is invalid
  }
  return format(date, 'HH:mm');
}

interface NotificationContentProps {
  content: Content;
  contentIndex?: number; // Using a different name than 'key'
}


// This component is now left for reference but we're using direct rendering instead
const NotificationContext: React.FC<NotificationContentProps> = ({ content, contentIndex }) => {
  console.log('Content received in component:', content, typeof content);

  // Use a simpler, more direct approach for rendering
  if (content === null || content === undefined) {
    return <span className="text-gray-400 italic">[Empty]</span>;
  }

  if (typeof content === 'string') {
    return <span className="font-bold">{content}</span>;
  }

  if (content && typeof content === 'object') {
    if ('ship' in content) {
      return <span className="text-blue-600">~{content.ship.replace('~', '')}</span>;
    }
    
    if ('emph' in content) {
      return <span className="italic">"{content.emph}"</span>;
    }
    
    return <span>[Object: {JSON.stringify(content)}]</span>;
  }

  return <span>[Unknown type]</span>;
}


function renderOrigin(origin: Origin, groups?: Groups) {
  console.log(origin.group)
  
  if (origin.group && groups?.[origin.group]) {
    const groupTitle = groups[origin.group]?.meta?.title || origin.group;
    
    if (origin.channel && groups[origin.group]?.channels?.[origin.channel]) {
      const channelTitle = groups[origin.group]?.channels?.[origin.channel]?.meta?.title || origin.channel;
      return (
        <div className="flex items-center space-x-2 text-gray-400">
          <GroupAvatar image={groups?.[origin.group]?.meta?.image} />
          <span className="font-bold text-gray-400">
            {origin.desk} • {groupTitle}: {channelTitle}
          </span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <GroupAvatar image={groups?.[origin.group]?.meta?.image} />
        <span className="font-bold text-gray-400">
          {origin.desk} • {groupTitle}
        </span>
      </div>
    );
  }
  
  console.log('desk', origin.desk)
  return (
    <div className="flex items-center text-gray-400">
      <span className="font-bold text-gray-400">{origin.desk}</span>
    </div>
  );
}

export const DingNotificationItem: React.FC<DingNotificationProps> = ({ 
  firstNotification,
  bundleWithOrigin,
  allNotifications,
  count, 
  groups
}) => {
  const [expanded, setExpanded] = useState(false);
  const isUnread = true; // TODO: Implement read/unread tracking
  
  
  // Callback to mark notification as read
  const onClick = useCallback(() => {
    // TODO: Implement mark as read functionality
  }, [firstNotification.id]);
  
  // Toggle expanded state
  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  }, [expanded]);

  console.log('content', firstNotification.contents, firstNotification.contents.length > 0)

  return (
    <div
      className={cn(
        'flex space-x-3 rounded-xl p-3 text-gray-600 transition-colors duration-1000',
        isUnread
          ? 'bg-blue-50 mix-blend-multiply dark:mix-blend-screen'
          : 'bg-white'
      )}
    >
      <DeskLink
        onClick={onClick}
        to={`?landscape-note=${encodeURIComponent(firstNotification.id)}`}
        desk={firstNotification.origin.desk || ''}
        className="flex flex-1 space-x-3"
      >
        <div className="relative flex-none self-start">
          {firstNotification.origin.group ? (
            <GroupAvatar image={groups?.[firstNotification.origin.group]?.meta?.image} size="default w-12 h-12" />
          ) : ( <span>~</span>
            // <Avatar shipName={firstNotification.destination.ext || firstNotification.destination.int || ''} size="default" />
          )}
        </div>
        <div className="w-full flex-col space-y-2">
          {renderOrigin(firstNotification.origin, groups)}
          <div>
            <p className="leading-5 text-gray-800">
              {firstNotification.contents && firstNotification.contents.length > 0 ? (
                // Simple direct rendering for debugging
                <div className="border-l-4 border-blue-500 pl-2">
                  {firstNotification.contents.map((content, index) => {
                    console.log('Mapping content at parent level:', content, index, typeof content);
                    
                    // Instead of using the component, render directly for now
                    if (typeof content === 'string') {
                      return (
                        <span key={index} className="text-black font-semibold">
                          {content}
                        </span>
                      );
                    } else if (content && typeof content === 'object') {
                      if ('ship' in content) {
                        return (
                          <span key={index} className="text-blue-600 font-bold">
                            ~{content.ship.replace('~', '')}
                          </span>
                        );
                      } else if ('emph' in content) {
                        return (
                          <span key={index} className="text-green-600 italic">
                            "{content.emph}"
                          </span>
                        );
                      }
                    }
                    
                    return (
                      <span key={index} className="text-red-500">
                        [Unknown: {JSON.stringify(content)}]
                      </span>
                    );
                  })}
                </div>
              ) : (
                <span className="text-gray-400 italic">[No content]</span>
              )}
            </p>
          </div>
          
          {/* Show notification count and expand button if there are multiple */}
          {count > 1 && (
            <div className="mt-2 flex items-center">
              <span className="mr-2 text-sm text-gray-500">
                {count} notifications from this source
              </span>
              <button 
                onClick={toggleExpanded}
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
              >
                {expanded ? 'Collapse' : 'Show all'}
              </button>
            </div>
          )}
          
          {/* Expanded view for all notifications */}
          {/* Removed debug element */}
          
          {expanded && count > 1 && allNotifications && allNotifications.length > 1 && (
            <div className="mt-2 space-y-2 border-t border-gray-200 pt-2">
              {allNotifications.slice(1).map((notification, index) => (
                <div key={index} className="rounded-lg bg-white p-2 shadow-sm">
                  <p className="mb-1 text-xs text-gray-400">
                    {makePrettyTime(notification.time ? new Date(notification.time) : new Date())}
                  </p>
                  <p className="text-sm text-gray-800">
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(notification, null, 2)}
                    </pre>
                    
                    {notification.contents && notification.contents.length > 0 ? (
                      <div className="mt-2 border-t pt-2">
                        {notification.contents.map((content, contentIndex) => {
                          console.log('Expanded notification content:', content, contentIndex, typeof content);
                          
                          // Instead of using component, render directly for debugging
                          if (typeof content === 'string') {
                            return (
                              <div key={contentIndex} className="mb-1">
                                <span className="bg-yellow-100 px-1 text-black">"{content}"</span>
                              </div>
                            );
                          } else if (content && typeof content === 'object') {
                            return (
                              <div key={contentIndex} className="mb-1">
                                <span className="bg-blue-100 px-1">
                                  {JSON.stringify(content)}
                                </span>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={contentIndex} className="mb-1">
                              <span className="bg-red-100 px-1">
                                [Unknown type]
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">[No content]</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DeskLink>
      <div className="flex-none">
        <div className="flex items-center">
          <span className="font-semibold text-gray-400">
            {firstNotification.time ? 
              makePrettyTime(new Date(firstNotification.time)) : 
              "No time"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DingNotificationItem;

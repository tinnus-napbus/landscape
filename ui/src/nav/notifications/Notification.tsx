import React, { useCallback, useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { format } from 'date-fns';
import _ from 'lodash';
import { pluralize, getAppName } from '@/logic/utils';
import { Notification, YarnContent as Content, Origin, isContentShip, Flag } from '@/gear';
import { useCharge } from '../../state/docket';
import { Groups } from './groups';
import { Avatar } from '../../components/Avatar';
import { ShipName } from '../../components/ShipName';
import { DeskLink } from '../../components/DeskLink';
import { DocketImage } from '../../components/DocketImage';
import GroupAvatar from '../../components/GroupAvatar';
import { useReadOrigin, useReadId } from '@/state/hark';

interface NotificationProps {
  firstNotification: Notification;
  isUnread: boolean,
  allNotifications: Notification[];
  count: number;
  groups: Groups | undefined;
}

interface NotificationContextProps {
  origin: Origin;
  groups?: Groups;
}

interface NotificationContentProps {
  contents: Content[];
  channel: Flag | null;
}


function makePrettyTime(date: Date) {
  if (!date || isNaN(date.getTime())) {
    return '--:--';
  }
  return format(date, 'HH:mm');
}


const NotificationContext: React.FC<NotificationContextProps> = ({origin, groups}) => {
  const charge = useCharge('groups')
  const app = getAppName(charge);

  if(origin.group !=  null){
    return(
      <div className="flex items-center space-x-2 text-gray-400">
        <span className="font-bold text-gray-400">
          {app} 
          {groups?.[origin.group]?.meta?.title && 
            ` • ${groups?.[origin.group]?.meta?.title}`
          }
        </span>
      </div>
    )
  }
  if(origin.group !=  null && origin.channel != null){
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <span className="font-bold text-gray-400">{app} • {groups?.[origin.group]?.meta?.title}:{' '}
            {groups?.[origin.group]?.channels?.[origin.channel]?.meta?.title}
          </span>
      </div>
    )
  }
  if(origin.desk != null){
    // const charge = useCharge('groups')  //(origin.desk ?? '');
    // const app = getAppName(charge);

    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <span className="font-bold text-gray-400">{app}</span>
      </div>
    );
  }

  return null;
}

const NotificationContent: React.FC<NotificationContentProps>  = ({channel, contents}) => {

  const isChannel = channel !== null
  const line = (contents[1] || '').toString();
  const mentionRe = new RegExp('mentioned');
  const replyRe = new RegExp('replied');

  const isMention = isChannel && mentionRe.test(line);
  console.log('isMention', isMention, contents)
  const isReply = isChannel && replyRe.test(line);

  function renderContent(content: Content) {
    if (typeof content === 'string') {
      const PATP_REGEX = /(~[a-z0-9-]+)/i;
      const URL_REGEX = /(http(s?):\/\/[^\s]+)/i;
      const COMBO_REGEX = /(~[a-z0-9-]+|https?:\/\/[^\s]+)/i;
      const parts = content.split(COMBO_REGEX);

      return (
        <>
          {parts.map((part, index) => {
            if (part.match(URL_REGEX)) {
              return (
                <span className="break-all" key={index}>
                  {part}
                </span>
              );
            }
            if (part.match(PATP_REGEX)) {
              return (
                <ShipName
                  key={index}
                  name={part}
                  className="font-semibold text-gray-800"
                  showAlias={true}
                />
              );
            } else {
              return (<span key={index}>{part}</span>)
            }
          })}
        </>
      );
    }

    if ('ship' in content) {
      return (
        <ShipName
          key={content.ship}
          name={content.ship}
          className="font-semibold text-gray-800"
          showAlias={true}
        />
      );
    }

    return <span key={content.emph}>&ldquo;{content.emph}&rdquo;</span>;
  
  }

  if (isMention) {
    return (
      <div className="flex-col">
        <p className="leading-5 text-gray-400 line-clamp-2">
          {_.map(_.slice(contents, 0, 2), (c: Content) => renderContent(c))}
        </p>
        <p className="leading-5 text-gray-800 line-clamp-2">
          {_.map(_.slice(contents, 2), (c: Content) => renderContent(c))}
        </p>
      </div>
    );
  }

  if (isReply) {
    return (
      <div className="flex-col">
        <p className="leading-5 text-gray-400 line-clamp-1">
          {_.map(_.slice(contents, 0, 4), (c: Content) => renderContent(c))}
        </p>
        <p className="leading-5 text-gray-800 line-clamp-2">
          {_.map(_.slice(contents, 6), (c: Content) => renderContent(c))}
        </p>
      </div>
    );
  }

  return (
    <p className="leading-5 text-gray-800 line-clamp-2 w-80">
      {_.map(contents, (c: Content) => renderContent(c))}
    </p>
    );
  };

export const NotificationItem: React.FC<NotificationProps> = ({ 
  firstNotification,
  isUnread,
  allNotifications,
  count, 
  groups
}) => {
  const expandedRef = useRef(false);
  const [expanded, setExpanded] = useState(expandedRef.current);
  const { mutate: readOrigin } = useReadOrigin();
  const { mutate: readId } = useReadId();
  const [currentCount, setCurrentCount] = useState(count)

  const isMounted = useRef(true);


  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const toggleExpanded = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    expandedRef.current = !expanded;
    setExpanded(!expanded);
  }, [expanded]);
  

  const onOriginClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    let origin = firstNotification.origin
    readOrigin({ origin });
  }, [firstNotification?.origin, readOrigin]);

  const onNotificationClick = useCallback((id) => {
    readId({ id },
        {onSuccess: () => {
            console.log('on read of single notification, array length is ', currentCount)
            if(currentCount > 2){
                setCurrentCount(currentCount - 1)
                setExpanded(expandedRef.current);
            }else{
                setExpanded(false);
            }
        }}
    );
  }, [readId, currentCount]);
  
  return (
    <div>
      {!expanded ?
      <div
        className={cn(
          'flex space-x-3 rounded-xl p-3 text-gray-600 transition-colors duration-1000',
          isUnread
            ? 'bg-blue-50 mix-blend-multiply dark:mix-blend-screen'
            : 'bg-white'
        )}
      >
        <DeskLink
          onClick={isUnread ? (e) => onOriginClick(e) : undefined}
          to={firstNotification.destination}
          desk={'groups'}
          // desk={firstNotification.origin.desk || ''}
          className="flex-col flex-1 space-x-3"
        >
          <div className="flex space-x-2">
            <div className="relative flex-none self-start">
              {firstNotification.origin.group != null ?
                <GroupAvatar image={groups?.[firstNotification.origin.group]?.meta?.image} />
                : 
                (() => {
                  const charge = useCharge('groups');
                  return <DocketImage {...charge} size="default" />;
                })()
              }
            </div>
            <div className="flex-col space-y-0.5 w-full">
              <div className="w-full flex justify-between space-x-2 pl-1.5 pr-1">
                <NotificationContext origin={firstNotification.origin} groups={groups}/>
                <div className="flex items-center">
                {isUnread &&
                  <button className="font-semibold text-gray-400" onClick={(e)=> onOriginClick(e)}>Mark as read</button>
                }
                </div>
              </div>
              <div className='flex w-full justify-between pl-1.5 pt-1.5 pr-1'>
                {firstNotification.contents && firstNotification.contents.length > 0 ? (
                  <div className="flex space-x-2 items-center">
                      {firstNotification.contents.find(isContentShip)?.ship ?  
                      <Avatar
                        shipName={firstNotification.contents.find(isContentShip)?.ship ?? ''}
                        size="xs" 
                      /> :  <></>
                      }
                      <NotificationContent contents={firstNotification.contents} channel={firstNotification.origin.channel}/>
                  </div>
                      ) : (
                    <span className=""></span>
                  )}
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-400 items-end w-100">
                      {makePrettyTime(firstNotification.time ? new Date(firstNotification.time) : new Date())}
                    </span>
                  </div>
                </div>
                {count > 1 ? (
                    <div>
                      <button className="text-sm font-semibold text-gray-600 p-1.5" onClick={(e)=>{
                        e.stopPropagation();
                        toggleExpanded(e)}}>
                        Latest of {count} new {pluralize('message', count)}
                      </button>
                    </div>
                  ) : null}
            </div>
          </div>
        </DeskLink>
      </div> 
      :
      <div className={cn('flex flex-col rounded-xl', isUnread
        ? 'bg-blue-50 mix-blend-multiply dark:mix-blend-screen'
        : 'bg-white')}>
      {allNotifications.map((notification, index) => {
        return (
        <div
          key={index}
          className={cn('flex space-x-3 rounded-xl pl-3 pb-0 text-gray-600 transition-colors duration-1000 mix-blend-multiply dark:mix-blend-screen',
            index === 0 ? 'pt-3' : 'pt-1'
          )}
        >
          <DeskLink
            onClick={isUnread ? () => onNotificationClick(notification.id) : undefined}
            to={notification.destination}
            desk={notification.origin.desk || ''}
            className="flex-col flex-1 space-x-3"
          >
            <div className="flex mr-2.5">
              <div className="relative flex-none self-start">
                {index === 0 ? 
                (notification.origin.group != null ?
                  <GroupAvatar image={groups?.[notification.origin.group]?.meta?.image} /> : 
                  (() => {
                    const charge = useCharge('groups');
                    return <DocketImage {...charge} size="default" className=""/>;
                  })()
                ) : <div className="w-12"></div>}
              </div>
              <div className="flex-col space-y-0.5 w-full ml-2">
                {index === 0 &&
                <div className="w-full flex justify-between pl-1.5 pr-1.5">
                  <NotificationContext origin={notification.origin} groups={groups}/>
                  <div className="flex items-center">
                    {isUnread &&
                      <button className="font-semibold text-gray-400" onClick={(e)=> onOriginClick(e)}>Mark as read</button>
                    }
                  </div>
                </div>
                }
                <div className='group flex w-full justify-between hover:bg-blue-50 rounded-md transition-colors duration-300 p-1.5 mr-1'>
                  {notification.contents && notification.contents.length > 0 ? (
                    <div className="flex space-x-2 items-center">
                      {notification.contents.find(isContentShip)?.ship ?  
                      <Avatar
                        shipName={notification.contents.find(isContentShip)?.ship ?? ''}
                        size="xs" 
                      /> :  <></>
                      }
                      <NotificationContent contents={notification.contents} channel={notification.origin.channel}/>
                    </div>
                    ) : (
                      <span className=""></span>
                    )}
                    <div className="flex items-center">
                      <span className={`font-semibold text-gray-400 ${isUnread ? 'group-hover:hidden' : ''}`}>
                      {makePrettyTime(notification.time ? new Date(notification.time) : new Date())}
                      </span>
                      {isUnread && (
                      <button 
                        className="font-semibold text-gray-400 hidden group-hover:block"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onNotificationClick(notification.id);
                        }}
                      >
                        Mark as read
                      </button>
                      )}
                    </div>
                  </div>
                  {index === count-1 ? (
                    <div className='pb-3'>
                      <button className="text-sm font-semibold text-gray-600 p-1" onClick={(e)=>{
                        e.stopPropagation();
                        toggleExpanded(e)}}>
                        Show Less
                      </button>
                    </div>
                    ) 
                  : null}
                </div>
              </div>
            </DeskLink>
          </div>
        )})}
      </div>
    }
    </div>
  )
}

export default NotificationItem;
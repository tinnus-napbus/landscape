import _ from 'lodash';
import {
  Bundles,
  DingUpdate
} from '@/gear';
import useReactQuerySubscription from '@/logic/useReactQuerySubscription';
import { useQueryClient } from '@tanstack/react-query';
import { SettingsState } from './settings';
import {
  isNewNotificationSupported,
  makeBrowserNotification,
} from '@/logic/utils';


export function useBundles() {
  const queryClient = useQueryClient();
  const { data, ...rest } = useReactQuerySubscription<Bundles, DingUpdate>({
    queryKey: ['bundles'],
    app: 'ding',
    path: '/all',
    scry: '/bundles/unread',
    options: {
      refetchOnMount: true,
      retry: 1,
    },
    onEvent: (event) => {
      if (!('new' in event)) {
        return;
      }

      const settings = queryClient.getQueryData<SettingsState>([
        'settings',
        window.desk,
      ]);
      const doNotDisturb = settings?.display?.doNotDisturb || false;
      if (!isNewNotificationSupported() || doNotDisturb) {
        return;
      }

      if (Notification.permission === 'granted') {
        //TODO: chenge this logic to ding update
        makeBrowserNotification(event['add-yarn'].yarn);
      }
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    },
  });

  // Extract the bundles array from the response object
  return {
    data: data && 'bundles' in data ? data.bundles as Bundles : [] as Bundles,
    ...rest,
  };
}
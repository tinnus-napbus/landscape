import _ from 'lodash';
import {
  Bundles,
  BundleWithOrigin,
  Id,
  DingUpdate,
  DingAction,
  Origin,
  Content,
  Destination
  BundleWithOrigin,
  Id,
  DingUpdate,
  DingAction,
  Origin,
  Content,
  Destination
} from '@/gear';
import useReactQuerySubscription from '@/logic/useReactQuerySubscription';
import useReactQueryScry from '@/logic/useReactQueryScry';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useReactQueryScry from '@/logic/useReactQueryScry';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsState } from './settings';
import {
  isNewNotificationSupported,
  makeBrowserNotification,
} from '@/logic/utils';
import api from '@/api';


function dingAction(action: DingAction) {
  return {
    app: 'ding',
    mark: 'ding-action',
    json: action,
  };
}
import api from '@/api';


function dingAction(action: DingAction) {
  return {
    app: 'ding',
    mark: 'ding-action',
    json: action,
  };
}

export function useBundles() {
  const queryClient = useQueryClient();
  const { data: dataNew, ...restNew } = useReactQuerySubscription<Bundles, DingUpdate>({
    queryKey: ['bundles-unread'],
  const { data: dataNew, ...restNew } = useReactQuerySubscription<Bundles, DingUpdate>({
    queryKey: ['bundles-unread'],
    app: 'ding',
    path: '/all',
    scry: '/bundles/unread',
    options: {
      refetchOnMount: true,
      retry: 1,
    },
    onEvent: (event) => {

      if (!('new' in event) && !('read' in event)) {
        return;
      }

      if ('read' in event) {
        queryClient.invalidateQueries(['bundles-read']);

      if (!('new' in event) && !('read' in event)) {
        return;
      }

      if ('read' in event) {
        queryClient.invalidateQueries(['bundles-read']);
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
        makeBrowserNotification(event['new']);
        makeBrowserNotification(event['new']);
      }
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    },
  });

  if (restNew.isLoading || restNew.isError) {
    return {
      newBundles: [] as Bundles,
      ...restNew,
    };
  }

  const newBundles = dataNew && 'bundles' in dataNew ? dataNew.bundles as Bundles : [] as Bundles;


  return {
    newBundles: newBundles as Bundles,
    ...restNew,
  };
}

export function useBundlesRead(date: string){
  // Track if this is a pagination request
  const isPagination = date !== '~';


  console.log('scy at', `/bundles/read/${date}/30`)
  // Include date in query key to differentiate between requests
  const { data: dataRead, ...rest } = useReactQueryScry<Bundles>({
    queryKey: ['bundles-read', date], // Include date in query key
    app: 'ding',
    path: `/bundles/read/${date}/30`,
    options: {
      refetchOnMount: !isPagination,
      retry: 1,
      refetchOnWindowFocus: false
    }
  })

  if (rest.isLoading || rest.isError) {
    return {
      read: {} as Bundles,
      ...rest,
    };
  }

  const readBundles = dataRead && 'bundles' in dataRead ? dataRead.bundles as Bundles : [] as Bundles;


  if (restNew.isLoading || restNew.isError) {
    return {
      newBundles: [] as Bundles,
      ...restNew,
    };
  }

  const newBundles = dataNew && 'bundles' in dataNew ? dataNew.bundles as Bundles : [] as Bundles;


  return {
    newBundles: newBundles as Bundles,
    ...restNew,
  };
}

export function useBundlesRead(date: string){
  // Track if this is a pagination request
  const isPagination = date !== '~';


  console.log('scy at', `/bundles/read/${date}/30`)
  // Include date in query key to differentiate between requests
  const { data: dataRead, ...rest } = useReactQueryScry<Bundles>({
    queryKey: ['bundles-read', date], // Include date in query key
    app: 'ding',
    path: `/bundles/read/${date}/30`,
    options: {
      refetchOnMount: !isPagination,
      retry: 1,
      refetchOnWindowFocus: false
    }
  })

  if (rest.isLoading || rest.isError) {
    return {
      read: {} as Bundles,
      ...rest,
    };
  }

  const readBundles = dataRead && 'bundles' in dataRead ? dataRead.bundles as Bundles : [] as Bundles;


  return {
    read: readBundles as Bundles,
    read: readBundles as Bundles,
    ...rest,
  };
}

export function useReadOrigin(){
  const queryClient = useQueryClient();
  const mutationFn = async (props: { origin: Origin; update?: boolean }) =>
    api.poke({...dingAction({
        'read-origin': props.origin,
    })})

  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['bundles-read']);
      await queryClient.cancelQueries(['bundles-un;read']);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['bundles-read']);
      await queryClient.invalidateQueries(['bundles-unread']);
    },
  })
}

export function useReadId(){
  const queryClient = useQueryClient();
  const mutationFn = async (variables: { id: Id; update?: boolean }) =>
    api.poke({
      ...dingAction({
        'read': {'id': variables.id},
      }),
  });

  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['bundles-read']);
      await queryClient.cancelQueries(['bundles-unread']);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['bundles-read']);
      await queryClient.invalidateQueries(['bundles-unread']);
    },
  });
};

export function useReadAll(){
  const queryClient = useQueryClient();
  const mutationFn = async () =>
    api.poke(
      dingAction({'read-all': null,}),
    );

  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['bundles-read']);
      await queryClient.cancelQueries(['bundles-unread']);
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['bundles-read']);
      await queryClient.invalidateQueries(['bundles-unread']);
    },
  })
}

export function useHasInviteToGroup(): BundleWithOrigin | undefined {
  const { newBundles: bundles, status } = useBundles()
  console.log('got bundles', bundles)
  if (!bundles) {
    return undefined;
  }

  return bundles.find(
    (bundleWithOrigin) =>
      bundleWithOrigin.bundle.some((bundle) =>{
        return bundleWithOrigin.origin.desk === 'groups' &&
        bundle.notification.contents.some((content)=> content === ' sent you an invite to ')
      })
  );
}

interface NotificationData {
  contents: Content[];
  destination: Destination;
}

export function useCreateDingNotification(){

  function dateNowToUnsignedBase32() {
    const timestamp = Date.now();
    const base32Chars = '0123456789ABCDEFGHJKMNPQRSTUVWXYZ';
    
    let result = '';
    let value = timestamp;
    
    while (value > 0) {
      result = base32Chars[value % 32] + result;
      value = Math.floor(value / 32);
    }
    
    return result || '0';
  }

  const queryClient = useQueryClient();
  const mutationFn = async (variables: { newNote: NotificationData }) => {
    return api.poke<DingAction>({
      app: 'ding',
      mark: 'ding-action',
      json: {
        'create': {
          id: dateNowToUnsignedBase32(),
          origin: {
            desk: window.desk,
            path: '/apps',
            group: null,
            channel: null,
          },
          ...variables.newNote,
        },
      },
    });
  }

  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['bundles-unread']);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['bundles-unread']);
    },
  });
}
import _ from 'lodash';
import {
  HarkAction,
  HarkAction1,
  HarkAction2,
  Id,
  NewYarn,
  Rope,
  Seam,
  Bundles,
  HarkUpdate,
  Origin,
  BundleWithOrigin, 
  YarnContent as Content,
  Destination
} from '@/gear';
import useReactQuerySubscription from '@/logic/useReactQuerySubscription';
import useReactQueryScry from '@/logic/useReactQueryScry';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsState } from './settings';
import {
  isNewNotificationSupported,
  makeBrowserNotification,
} from '@/logic/utils';
import api from '@/api';

function harkAction(action: HarkAction) {
  return {
    app: 'hark',
    mark: 'hark-action',
    json: action,
  };
}

// export function useSkeins() {
//   const queryClient = useQueryClient();
//   const { data, ...rest } = useReactQuerySubscription<Skein[], HarkAction>({
//     queryKey: ['skeins'],
//     app: 'hark',
//     path: '/ui',
//     scry: '/all/skeins',
//     options: {
//       refetchOnMount: true,
//       retry: 1,
//     },
//     onEvent: (event) => {
//       if (!('add-yarn' in event)) {
//         return;
//       }

      // const settings = queryClient.getQueryData<SettingsState>([
      //   'settings',
      //   window.desk,
      // ]);
      // const doNotDisturb = settings?.display?.doNotDisturb || false;
      // if (!isNewNotificationSupported() || doNotDisturb) {
      //   return;
      // }

  //     if (Notification.permission === 'granted') {
  //       makeBrowserNotification(event['add-yarn'].yarn);
  //     }
  //     if (Notification.permission === 'default') {
  //       Notification.requestPermission();
  //     }
  //   },
  // });

//   return {
//     data: data as Skein[],
//     ...rest,
//   };
// }

export function useSawRopeMutation() {
  const queryClient = useQueryClient();
  const mutationFn = async (variables: { rope: Rope; update?: boolean }) =>
    api.trackedPoke(
      harkAction({
        'saw-rope': variables.rope,
      }),
      { app: 'hark', path: '/ui' }
    );

  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['skeins']);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['skeins']);
    },
  });
}

export function useSawSeamMutation() {
  const queryClient = useQueryClient();
  const mutationFn = async (variables: { seam: Seam }) =>
    api.poke({
      ...harkAction({
        'saw-seam': variables.seam,
      }),
    });

  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['skeins']);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['skeins']);
    },
  });
}

export function useHasInviteToGroup(): BundleWithOrigin | undefined {
  const { newBundles: bundles, status } = useBundles()
  if (!Array.isArray(bundles)) {
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

interface NewYarnData extends Omit<NewYarn, 'all' | 'desk' | 'rope'> {
  rope?: Rope;
}

export function useAddYarnMutation() {
  const queryClient = useQueryClient();
  const mutationFn = async (variables: { newYarn: NewYarnData }) => {
    return api.poke<HarkAction1>({
      app: 'hark',
      mark: 'hark-action-1',
      json: {
        'new-yarn': {
          all: true,
          desk: true,
          rope: {
            desk: window.desk,
            group: null,
            channel: null,
            thread: '/apps',
          },
          ...variables.newYarn,
        },
      },
    });
  };
  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['skeins']);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['skeins']);
    },
  });
}

function harkAction2(action: HarkAction2) {
  return {
    app: 'hark',
    mark: 'hark-action-2',
    json: action,
  };
}

export function useBundles() {
  const queryClient = useQueryClient();

  const { data: dataNew, ...restNew } = useReactQuerySubscription<{bundles: Bundles}, HarkUpdate>({
    queryKey: ['bundles-unread'],
    app: 'hark',
    path: '/1/all',
    scry: '/1/bundles/unread',
    options: {
      refetchOnMount: true,
      retry: 1,
    },
    onEvent: (event) => {

      if (!('new' in event) && !('read' in event)) {
        return;
      }

      if ('read' in event) {
        queryClient.removeQueries({
          predicate: (query) => {
            return Array.isArray(query.queryKey) && 
                  query.queryKey[0] === 'bundles-read-since';
          }
        });

        const allQueries = queryClient.getQueryCache().getAll();

        const numericQueries = allQueries
          .filter(query => 
            Array.isArray(query.queryKey) && 
            query.queryKey[0] === 'bundles-read' && 
            typeof query.queryKey[1] === 'string' &&
            query.queryKey[1] !== '~' && 
            !isNaN(Number(query.queryKey[1]))
          );
        
        const lastKey = numericQueries.length > 0 
          ? numericQueries.reduce((oldest, current) => 
              Number(current.queryKey[1]) < Number(oldest.queryKey[1]) 
                ? current 
                : oldest
            ).queryKey
          : ['bundles-read', '~'];
            
          if(typeof lastKey[1] === 'string' && lastKey[1] !== '~'){
            fetchBundlesReadData({
              path: `/1/bundles/read/${lastKey[1].toString()}`
            }).then(data => {
              queryClient.setQueryData(['bundles-read-since', lastKey[1]], data);
            }).catch(error => {
              console.error('Failed to fetch bundle data:', error);
            });
          } else if(typeof lastKey[1] === 'string' && lastKey[1] === '~'){
            fetchBundlesReadData({
              path: `/1/bundles/read/~/51`
            }).then(data => {
              queryClient.setQueryData(['bundles-read-since', '~'], data);
            }).catch(error => {
              console.error('Failed to fetch bundle data:', error);
            });
          }
          queryClient.removeQueries({
            predicate: (query) => {
              return Array.isArray(query.queryKey) && 
                    query.queryKey[0] === 'bundles-read' 
                    && 
                    (query.queryKey.length < 2 || query.queryKey[1] !== lastKey[1]);
            }
          });
        
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
  console.log('got bundles', dataNew)

  const newBundles = dataNew && 'bundles' in dataNew ? dataNew.bundles as Bundles : [] as Bundles;


  return {
    newBundles: newBundles as Bundles,
    ...restNew,
  };
}

const fetchBundlesReadData = async ({path}: {path: string}) => {
  try {
    const response = await api.scry({
      app: 'hark',
      path: path,
    });

    return response;
  } catch (error) {
    console.error('Error fetching bundle data:', error);
    throw error;
  }
};


export function useBundlesRead(date: string){
  const { data: dataRead, ...rest } = useReactQueryScry<{bundles: Bundles}>({
    queryKey: ['bundles-read', date],
    app: 'hark',
    path: `/1/bundles/read/${date}/50`,
    options: {
      refetchOnMount: false,
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 5 * 60 * 1000
    }
  })

  if (rest.isLoading || rest.isError) {
    return {
      read: {} as Bundles,
      ...rest,
    };
  }
  console.log('got data', dataRead)

  const readBundles = dataRead && 'bundles' in dataRead ? dataRead.bundles as Bundles : [] as Bundles;

  return {
    read: readBundles as Bundles,
    ...rest,
  };
}

export function useReadOrigin(){
  const mutationFn = async (props: { origin: Origin; update?: boolean }) =>
    api.poke({...harkAction2({
        'read-origin': props.origin,
    })})

  return useMutation(mutationFn, {
    onMutate: async () => {
    },
    onSettled: async (_data, _error) => {
    },
  })
}

export function useReadId(){
  const queryClient = useQueryClient();
  const mutationFn = async (variables: { id: Id; update?: boolean }) =>
    api.poke({
      ...harkAction2({
        'read': {'id': variables.id},
      }),
  });

  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['bundles-unread']);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['bundles-unread']);
    },
  });
};

export function useReadAll(){
  const queryClient = useQueryClient();
  const mutationFn = async () =>
    api.poke(
      harkAction2({'read-all': null,}),
    );

  return useMutation(mutationFn, {
    onMutate: async () => {
      await queryClient.cancelQueries(['bundles-read', '~']);
      await queryClient.cancelQueries(['bundles-unread']);
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
    },
    onSettled: async (_data, _error) => {
      await queryClient.invalidateQueries(['bundles-unread']);
    },
  })
}

interface NotificationData {
  contents: Content[];
  destination: Destination;
}

export function useCreateNotification(){

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
    return api.poke<HarkAction2>({
      app: 'hark',
      mark: 'hark-action-2',
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
import { Pike } from '@/gear';
import React from 'react';
import { AppList } from '../../components/AppList';
import { Button } from '../../components/Button';
import {
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '../../components/Dialog';
import * as Dialog from '@radix-ui/react-dialog';
import { FullTlon16Icon } from '../../components/icons/FullTlon16Icon';
import { useSystemUpdate } from '../../logic/useSystemUpdate';
import { usePike, useLag } from '../../state/kiln';
import useVereState from '../../state/vere';
import { useBossSysInfo, useBossOurInfo, useBossBlocks } from '../../state/boss';
import { disableDefault, pluralize } from '@/logic/utils';
import { ShipCode } from '@/components/ShipCode';

function getHash(pike: Pike): string {
  const parts = pike.hash.split('.');
  return parts[parts.length - 1];
}

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatToCustomDate(input: number): string {
  const date = new Date(input);
  if (isNaN(date.getTime())) {
    return ''; 
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  return date.toLocaleString('en-US', options).replace(',', '');
}

export const AboutSystem = () => {
  const basePike = usePike('base');
  const { systemBlocked, blockedCharges, blockedCount, freezeApps } = useSystemUpdate();
  const { data: sysInfo } = useBossSysInfo();
  const { data: ourInfo } = useBossOurInfo();
  const { data: number } = useBossBlocks();
  const gardenBlocked =
    null != blockedCharges.find((charge) => charge.desk == 'landscape');
  const hash = basePike && getHash(basePike);
  const lag = useLag();

  const vere = useVereState.getState();
  const { isLatest, vereVersion, latestVereVersion, loaded } = vere;

  const runtimeUpToDate = !loaded || isLatest;

  function convertRank(rank:string){
    if(rank === 'czar'){
        return 'galaxy'
    }else if(rank === 'king'){
        return 'star'
    }else if(rank === 'duke'){
        return 'planet'
    }else if(rank === 'earl'){
        return 'moon'
    }else{
        return 'comet'
    }
  }

  return (
    <>
      <div className="inner-section relative mb-4 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="h3">About System</h2>
          {systemBlocked && (
            <span className="rounded-md bg-orange-50 px-2 py-1 text-sm font-semibold text-orange-500">
              System Update Blocked
            </span>
          )}
        </div>
        <div className="space-y-4 leading-5">
          {/* <FullTlon16Icon className="h-4" /> */}
          <div className='flex items-center space-x-4 justify-between'>
            <h3 className='text-md font-bold whitespace-nowrap'>Urbit Kernel Version:</h3>
            <p>{hash}</p>
          </div>
        {sysInfo && Object.keys(sysInfo).length > 0 &&
          <div className='flex items-center space-x-4 justify-between'>
            <h3 className='text-md font-bold whitespace-nowrap'>Pace:</h3>
            <p>{capitalizeFirstLetter(sysInfo.pace)}</p>
          </div>
        }
        {sysInfo && Object.keys(sysInfo).length > 0 &&
          <div className='flex items-center space-x-4 justify-between'>
            <h3 className='text-md font-bold whitespace-nowrap'>Zuse:</h3>
            <p>{sysInfo.zuse}K</p>
          </div>
        }
        {sysInfo['ota-source'] && sysInfo['ota-source'].ship && sysInfo['ota-source'].desk && (
          <div className='flex items-center space-x-4 justify-between'>
            <h3 className='text-md font-bold whitespace-nowrap'>OTA Source:</h3>
            <p>{sysInfo['ota-source'].ship} {sysInfo['ota-source'].desk}</p>
          </div>
        )}
        {sysInfo && Object.keys(sysInfo).length > 0 &&
          <div className=''>
            <h3 className='text-md font-bold whitespace-nowrap'>Base desk hash:</h3>
            <p className='break-words'> {sysInfo['base-hash']}</p>
          </div>
        }
        {sysInfo && Object.keys(sysInfo).length > 0 &&
          <div className='flex items-center space-x-4 justify-between'>
            <h3 className='text-md font-bold whitespace-nowrap'>Last Base Update:</h3>
            <p>{formatToCustomDate(sysInfo['base-time'])}</p>
          </div>
        }
                {systemBlocked ? (
          <>
            {lag ? (
              <>
                <p className="text-orange-500">
                  System update failed because your runtime was out of date.
                </p>
                <p>
                  Your runtime version is {vereVersion}, the latest runtime
                  version is {latestVereVersion}.
                </p>
                <p>Update your runtime or contact your hosting provider.</p>
                <p>Once your runtime is up to date, click retry below.</p>
                <Button variant="caution" onClick={freezeApps}>
                  Retry System Update
                </Button>
              </>
            ) : blockedCount == 0 ? (
              <>
                <p className="text-orange-500">System update failed.</p>
                <p>
                  For additional debugging output, open the terminal and click
                  retry below.
                </p>
                <Button variant="caution" onClick={freezeApps}>
                  Retry System Update
                </Button>
              </>
            ) : (
              <>
                <p className="text-orange-500">
                  Update is currently blocked by the following{' '}
                  {pluralize('app', blockedCount)}:
                </p>
                <AppList
                  apps={blockedCharges}
                  labelledBy="blocked-apps"
                  size="xs"
                  className="font-medium"
                />
                {gardenBlocked ? (
                  <>
                    <p>
                      Landscape is the application launcher and system
                      interface. It needs an update before you can apply the
                      System Update.
                    </p>
                  </>
                ) : (
                  <Dialog.Root>
                    <DialogTrigger asChild>
                      <Button variant="caution">
                        Suspend {blockedCount}{' '}
                        {pluralize('App', blockedCount)} and Apply Update
                      </Button>
                    </DialogTrigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed top-0 bottom-0 left-0 right-0 z-[60] transform-gpu bg-black opacity-30" />
                      <DialogContent
                        showClose={false}
                        onOpenAutoFocus={disableDefault}
                        className="space-y-6 tracking-tight"
                        containerClass="w-full max-w-md z-[70]"
                      >
                        <h2 className="h4">
                          Suspend {blockedCount}{' '}
                          {pluralize('App', blockedCount)} and Apply System
                          Update
                        </h2>
                        <p>
                          The following {pluralize('app', blockedCount)} will
                          be suspended until their developer provides an
                          update.
                        </p>
                        <AppList
                          apps={blockedCharges}
                          labelledBy="blocked-apps"
                          size="xs"
                        />
                        <div className="flex space-x-6">
                          <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant="caution" onClick={freezeApps}>
                              Suspend {pluralize('App', blockedCount)} and
                              Update
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog.Portal>
                  </Dialog.Root>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {runtimeUpToDate ? (
              <>
                <div className='flex items-center space-x-4 justify-between'>
                  <h3 className='text-md font-bold whitespace-nowrap'>Urbit Runtime Version: </h3>
                  <p>{vereVersion}</p>
                </div>
                <p>Your urbit is up to date.</p>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4 text-orange">
                  <h3 className='text-md font-bold whitespace-nowrap'>Your runtime version is </h3>
                  <p>{vereVersion}</p>
                </div>
                <div className="flex items-center space-x-4 text-orange-500">
                  <h3 className='text-md font-bold whitespace-nowrap'>Latest runtime version:</h3>
                  <p>{latestVereVersion}</p>
                </div>
                <p className="text-orange-500">
                  <a
                    className="font-bold text-blue-500"
                    href="https://operators.urbit.org/manual/os/updates#runtime-updates"
                  >
                    Update your runtime{' '}
                  </a>
                  or contact your hosting provider.
                </p>
              </>
            )}
          </>
        )}
        </div>
      </div>
        <div className="inner-section relative mb-4 space-y-8">
        <h2 className="h3">Identity information</h2>
        { ourInfo ?
        <>
        <div className="flex items-center space-x-4 justify-between">
          <h3 className="text-md font-bold whitespace-nowrap">Urbit ID:</h3>
          <p className="leading-5">{ourInfo.our}</p>
        </div>
        <div className="flex items-center space-x-4 justify-between">
          <h3 className="text-md font-bold">Node Type:</h3>
          <p className="leading-5">{convertRank(ourInfo.rank)}</p>
        </div>
        {ourInfo.point ?
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Point Number:</h3>
            <p className="leading-5">{ourInfo.point}</p>
          </div>
          : null
          }
        <div className="flex items-center space-x-4 justify-between">
          <h3 className="text-md font-bold">Continuity Number:</h3>
          <p className="leading-5">{ourInfo.rift}</p>
        </div>
        <div className="flex items-center space-x-4 justify-between">
          <h3 className="text-md font-bold">Key Revision:</h3>
          <p className="leading-5">{ourInfo.life}</p>
        </div>
        { number != 0 ?
        <div className="flex items-center space-x-4 justify-between">
          <h3 className="text-md font-bold">Last Block:</h3>
          <p className="leading-5">{new Intl.NumberFormat('de-DE').format(number)}</p>
        </div> : null 
        }
        <div className="flex items-center space-x-4 justify-between">
          <h3 className="text-md font-bold">Sponsor:</h3>
          <p className="leading-5">{ourInfo.sponsor}</p>
        </div>
        {Array.isArray(ourInfo.chain) && ourInfo.chain.length > 0 ?
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Sponsor Chain:</h3>
            <p className="leading-5">{ourInfo.chain.join(" > ")}</p>
          </div> : null
        }
        {ourInfo.point !== null && ourInfo.point !== undefined &&
          <div className="space-y-8">
            {Object.keys(ourInfo?.point?.own?.owner).length > 0  &&
              <div className="flex items-center space-x-4 justify-between">
                <h3 className="text-md font-bold">Ownership Address:</h3>
                <p className="leading-5">{ourInfo.point.own.owner.address}</p>
              </div>
            }
            {Object.keys(ourInfo.point.own['management-proxy']).length > 0  &&
              <div className="flex items-center space-x-4 justify-between">
                <h3 className="text-md font-bold">Management Proxy:</h3>
                <p className="leading-5">{ourInfo.point.own['management-proxy'].address}</p>
              </div>
            }
            {Object.keys(ourInfo.point.own['transfer-proxy']).length > 0  &&
              <div className="flex items-center space-x-4 justify-between">
                <h3 className="text-md font-bold">Transfer Proxy:</h3>
                <p className="leading-5">{ourInfo.point.own['transfer-proxy'].address}</p>
              </div>
            }
            {ourInfo.point.net.escape !== null &&
              <div className="flex items-center space-x-4 justify-between">
                <h3 className="text-md font-bold">Escape Request:</h3>
                <p className="leading-5">{ourInfo.point.net.escape}</p>
              </div>
            }
          </div>
          }
          </> :
          null
        }
      </div>
      <div className="inner-section relative mt-4 space-y-8">
        <h2 className="h3">Access Key</h2>
        <p className="leading-5">
          Reveal or show your Landscape Access Key below to sign in to other
          browsers and mobile applications.
        </p>
        <ShipCode />
      </div>
    </>
  );
};

import React from 'react';
import { useBossOurInfo, useBossBlocks } from '../state/boss';
import { Moons } from './about-system/Moons'

export const ControlSystemPanel = () => {
  const { data: ourInfo } = useBossOurInfo();
  const { data: number } = useBossBlocks();



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
      <div className="inner-section space-y-8 mb-4">
        <h2 className="h4">Identity info</h2>
        { ourInfo ?
        <>
        <div className="flex items-center space-x-4 justify-between">
          <h3 className="text-md font-bold whitespace-nowrap">Urbit ID:</h3>
          <p className="leading-5">{ourInfo.our}</p>
        </div>
        <div className="flex items-center space-x-4 justify-between">
          <h3 className="text-md font-bold">Node Type</h3>
          <p className="leading-5">{convertRank(ourInfo.rank)}</p>
        </div>
          {ourInfo.point ?
            <div className="flex items-center space-x-4 justify-between">
              <h3 className="text-md font-bold">Point Number</h3>
              <p className="leading-5">{ourInfo.point}</p>
            </div>
            : null
            }
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Continuity Number</h3>
            <p className="leading-5">{ourInfo.rift}</p>
          </div>
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Key Revision</h3>
            <p className="leading-5">{ourInfo.life}</p>
          </div>
          { number != 0 ?
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Last Block</h3>
            <p className="leading-5">{new Intl.NumberFormat('de-DE').format(number)}</p>
          </div> : null 
          }
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Sponsor</h3>
            <p className="leading-5">{ourInfo.sponsor}</p>
          </div>
          {Array.isArray(ourInfo.chain) && ourInfo.chain.length > 0 ?
            <div className="flex items-center space-x-4 justify-between">
              <h3 className="text-md font-bold">Sponsor Chain</h3>
              <p className="leading-5">{ourInfo.chain.join(" > ")}</p>
            </div> : null
          }
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Ownership Address</h3>
            <p className="leading-5"></p>
          </div>
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Management Proxy</h3>
            <p className="leading-5"></p>
          </div>
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Transfer Proxy</h3>
            <p className="leading-5"></p>
          </div>
          <div className="flex items-center space-x-4 justify-between">
            <h3 className="text-md font-bold">Escape Request</h3>
            <p className="leading-5"></p>
          </div>
          </> :
          null
        }
      </div>
      {ourInfo.rank != 'pawn' ?
        <Moons/> : null
      }
    </>
  );
};
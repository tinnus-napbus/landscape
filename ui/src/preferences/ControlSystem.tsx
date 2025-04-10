import React, { useState } from 'react';
import { useBossAllowed, bossPack, bossMeld, bossExit } from '../state/boss';


export const ControlSystem = () => {
    const { data: allowed } = useBossAllowed()
    const [loadingPack, setLoadingPack] = useState(false);
    const [messagePack, setMessagePack] = useState<string | null>(null);
    const [loadingMeld, setLoadingMeld] = useState(false);
    const [messageMeld, setMessageMeld] = useState<string | null>(null);

    function isAllowed(poke:string){
      return !allowed?.black?.includes(poke)
    }

    async function onPack() {
      try {
        setMessagePack(null);
        setLoadingPack(true);
        const result = await bossPack();
      
        setMessagePack(result.message);
      } catch (error) {
        setLoadingPack(false);
        setMessagePack("Error occurred during pack.");
      } finally {
        setLoadingPack(false);
      }
    }

    async function onMeld() {
      setMessageMeld(null);
      try {
          setLoadingMeld(true);
          const result = await bossMeld();

          setMessageMeld(result.message);
        } catch (error) {
          setLoadingMeld(false);
          setMessageMeld("Error occurred during meld.");
        } finally {
          setLoadingMeld(false);
        }
    }

    return(
      <div className="space-y-3">
        {isAllowed('boss-pack') &&
        <div>
          <p className="leading-5">Defragment a ship's state. This will reduce the size of a ship's state.</p>
          <div className="flex justify-between items-center">
            <button className="button mt-2" onClick={()=>{onPack()}}>
            {loadingPack ? 'Packing...' : 'Pack'}
            </button>
            {messagePack && <div className="message">{messagePack}</div>}
          </div>
        </div>
        }
        {isAllowed('boss-meld') &&
          <div>
            <p className="leading-5">Deduplicate ship state. This can significantly reduce memory usage for ships with large states.</p>
            <div className="flex justify-between items-center">
              <button className="button mt-2" onClick={()=>{onMeld()}}>
              {loadingMeld ? 'Meld...' : 'Meld'}
              </button>
              {messageMeld && <div className="message">{messageMeld}</div>}
            </div>
          </div>
        }
        {isAllowed('boss-exit') &&
          <div>
            <p className="leading-5">This action will shut down your ship completely.</p>
            <button className="button mt-4" onClick={()=>{bossExit()}}>
            Shut Down ship
            </button>
          </div>
        }
      </div>
  )}
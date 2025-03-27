import React, { useState } from 'react';
import { bossPack, bossMeld, bossExit } from '../state/boss';

export const ControlSystem = () => {
    const [loadingPack, setLoadingPack] = useState(false);
    const [messagePack, setMessagePack] = useState<string | null>(null);
    const [loadingMeld, setLoadingMeld] = useState(false);
    const [messageMeld, setMessageMeld] = useState<string | null>(null);
  

    async function onPack() {
        setMessagePack(null);
        try {
            setLoadingPack(true);
            await bossPack();
          } catch (error) {
            setLoadingPack(false);
            setMessagePack("Error occurred during pack.");
          } finally {
            setLoadingPack(false);
            setMessagePack("Successfully performed pack!");
          }
    }

    async function onMeld() {
        setMessageMeld(null);
        try {
            setLoadingMeld(true);
            await bossMeld();
          } catch (error) {
            setLoadingMeld(false);
            setMessageMeld("Error occurred during meld.");
          } finally {
            setLoadingMeld(false);
            setMessageMeld("Successfully performed meld!");
          }
    }



    return(
    <div className="space-y-3">
      <p className="leading-5">Defragment a ship's state. This will reduce the size of a ship's state.</p>
      <div className="flex justify-between items-center">
        <button className="button" onClick={()=>{onPack()}}>
        {loadingPack ? 'Packing...' : 'Pack'}
        </button>
        {messagePack && <div className="message">{messagePack}</div>}
      </div>
      <p className="leading-5">Deduplicate ship state. This can significantly reduce memory usage for ships with large states.</p>
      <div className="flex justify-between items-center">
        <button className="button" onClick={()=>{onMeld()}}>
        {loadingMeld ? 'Meld...' : 'Meld'}
        </button>
        {messageMeld && <div className="message">{messageMeld}</div>}
      </div>
      <button className="button" onClick={()=>{bossExit()}}>
      Shut Down ship
      </button>
    </div>)
}
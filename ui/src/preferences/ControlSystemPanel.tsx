import React from 'react';
import { useBossAllowed, useBossOurInfo } from '../state/boss';
import { Moons } from './about-system/Moons'
import { Eyre } from './about-system/Eyre'
import { UpdatePreferences } from './about-system/UpdatePreferences';
import { ControlSystem } from './ControlSystem';

export const ControlSystemPanel = () => {
  const { data: allowed } = useBossAllowed()
  const { data: ourInfo } = useBossOurInfo();

  return (
    <>
      <UpdatePreferences />
      <div className="inner-section relative mt-4 space-y-8 mb-4">
        <h2 className="h3">System Control</h2>
        <ControlSystem />
      </div>
      <Eyre 
      forbidden={allowed.black}
      />
      {ourInfo.rank != 'pawn' ?
        <Moons
        forbidden={allowed.black}
        /> : null
      }
    </>
  );
};
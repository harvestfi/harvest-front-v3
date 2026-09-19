import React from 'react'

import ActiveRange from './ActiveRange'

import PositionComposition from './PositionComposition'

import MechanicsCard from './MechanicsCard'

const stackStyle = { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }

export const CLDetailsMain = ({ data }) => (
  <div style={{ ...stackStyle, marginBottom: '25px' }}>
    <ActiveRange data={data} />

    <PositionComposition data={data} />

    <MechanicsCard data={data} />
  </div>
)

export default CLDetailsMain

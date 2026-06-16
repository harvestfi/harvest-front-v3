import React from 'react'
import PositionPanel from './PositionPanel'
import HealthFactorPanel from './HealthFactorPanel'
import MechanicsCard from './MechanicsCard'
import SourceOfYieldPanel from './SourceOfYieldPanel'

const stackStyle = { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }

export const LoopDetailsMain = ({ data }) => (
  <div style={{ ...stackStyle, marginBottom: '25px' }}>
    <PositionPanel data={data} />
    <HealthFactorPanel data={data} />
    <MechanicsCard data={data} />
    <SourceOfYieldPanel data={data} />
  </div>
)

export default LoopDetailsMain

import React, { useState } from 'react'
import { BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { useThemeContext } from '../../providers/useThemeContext'
import CLDeposit from './CLDeposit'
import CLWithdraw from './CLWithdraw'
import { SwitchWrap, SwitchTab } from './style'

const CLInteract = ({ data, connected, onRefresh }) => {
  const { fontColor1, fontColor3, borderColorBox, activeColor, activeColorNew } = useThemeContext()
  const [action, setAction] = useState('supply')

  const switchTabs = [
    { name: 'Supply', img: BsArrowDown, key: 'supply' },
    { name: 'Revert', img: BsArrowUp, key: 'revert' },
  ]

  return (
    <div style={{ padding: '15px' }}>
      <SwitchWrap $border={borderColorBox}>
        {switchTabs.map(t => {
          const active = action === t.key
          return (
            <SwitchTab
              key={t.key}
              onClick={() => setAction(t.key)}
              $fontcolor={active ? fontColor1 : fontColor3}
              $backcolor={active ? activeColorNew : ''}
              $bordercolor={active ? activeColor : ''}
              $boxshadow={
                active
                  ? '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)'
                  : ''
              }
            >
              <t.img />
              <p>{t.name}</p>
            </SwitchTab>
          )
        })}
      </SwitchWrap>
      {action === 'supply' ? (
        <CLDeposit data={data} connected={connected} onRefresh={onRefresh} />
      ) : (
        <CLWithdraw data={data} connected={connected} onRefresh={onRefresh} />
      )}
    </div>
  )
}

export default CLInteract

import React from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Label } from './style'

const ListItem = ({ value, marginBottom, marginTop, vaultValue }) => {
  const { fontColor } = useThemeContext()

  return (
    <Container fontColor={fontColor} marginBottom={marginBottom} marginTop={marginTop}>
      {vaultValue ? (
        <>
          {value !== undefined ? (
            <>
              <Label>{`${value}:`}&nbsp;</Label>
              <Label color="#4caf50">{vaultValue}</Label>
            </>
          ) : (
            <Label color="#4caf50">{vaultValue}</Label>
          )}
        </>
      ) : (
        <Label>{value}</Label>
      )}
    </Container>
  )
}

export default ListItem

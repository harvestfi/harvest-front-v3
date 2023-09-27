import React from 'react'
import { SocialsContainer, Social } from './style'
import { SOCIAL_LINKS } from '../../constants'
import { useThemeContext } from '../../providers/useThemeContext'
import discord from '../../assets/images/logos/sidebar/discord.svg'
import twitter from '../../assets/images/logos/sidebar/twitter.svg'
import medium from '../../assets/images/logos/sidebar/medium.svg'

const Socials = () => {
  const { socialBackColor, socialIconColor } = useThemeContext()

  return (
    <SocialsContainer iconColor={socialIconColor} backColor={socialBackColor}>
      <Social href={SOCIAL_LINKS.DISCORD} target="_blank">
        <img src={discord} alt="" />
      </Social>
      <Social href={SOCIAL_LINKS.TWITTER} target="_blank">
        <img src={twitter} alt="" />
      </Social>
      <Social href={SOCIAL_LINKS.MEDIUM} target="_blank">
        <img src={medium} alt="" />
      </Social>
    </SocialsContainer>
  )
}

export default Socials

import React from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import FirstFarming1 from '../../assets/images/logos/tutorial/first-farming1.webp'
import FirstFarming2 from '../../assets/images/logos/tutorial/first-farming2.webp'
import FirstFarming3 from '../../assets/images/logos/tutorial/first-farming3.webp'
import FirstFarming4 from '../../assets/images/logos/tutorial/first-farming4.webp'
import FirstFarming5 from '../../assets/images/logos/tutorial/first-farming5.webp'
import Convert1 from '../../assets/images/logos/tutorial/convert1.webp'
import Convert2 from '../../assets/images/logos/tutorial/convert2.webp'
import Convert3 from '../../assets/images/logos/tutorial/convert3.webp'
import Convert4 from '../../assets/images/logos/tutorial/convert4.webp'
import Convert5 from '../../assets/images/logos/tutorial/convert5.webp'
import Convert6 from '../../assets/images/logos/tutorial/convert6.webp'
import Yield1 from '../../assets/images/logos/tutorial/yield1.webp'
import Yield2 from '../../assets/images/logos/tutorial/yield2.webp'
import Yield3 from '../../assets/images/logos/tutorial/yield3.webp'
import Extra1 from '../../assets/images/logos/tutorial/extra1.webp'
import Extra2 from '../../assets/images/logos/tutorial/extra2.webp'
import Extra3 from '../../assets/images/logos/tutorial/extra3.webp'

import {
  Container,
  TopSection,
  TopContainer,
  Inner,
  WrapperDiv,
  Title,
  DescText,
  DescImg,
  DescImgText,
  HeaderTitle,
  HeaderDesc,
  CoinSection,
} from './style'

const Home = () => {
  const { pageBackColor, fontColor } = useThemeContext()

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <TopSection>
        <TopContainer>
          <HeaderTitle>Your First Steps as a Crypto Farmer</HeaderTitle>
          <HeaderDesc>Learn how to get started with Harvest.</HeaderDesc>
        </TopContainer>
      </TopSection>
      <Inner>
        <CoinSection>
          <WrapperDiv>
            <DescText>In this tutorial, you will learn the following:</DescText>
            <br />
            <DescText>
              <ul className="top-list">
                <li>How can you benefit from yield farming with Harvest</li>
                <li>The tools you need to get started</li>
                <li>How to earn with yield farming step-by-step</li>
                <li>How to understand yield returns</li>
              </ul>
            </DescText>
          </WrapperDiv>
          <WrapperDiv>
            <Title>Introduction - What is Yield Farming?</Title>
            <DescText>
              Yield farming involves engaging your cryptocurrency in activities like lending,
              providing liquidity, or staking, enabling you to earn fees and token rewards from
              various projects.
              <br />
              <br />
              Harvest&apos;s farms make it easier and more efficient to earn on your crypto from a
              single and intuitive dashboard, compared to managing everything independently.
            </DescText>
          </WrapperDiv>
          <WrapperDiv>
            <Title>Benefits of Yield Farming with Harvest</Title>
            <DescText>
              The key advantage of Harvest is its auto-compounding feature, where the fees and
              rewards generated by your crypto are turned into more tokens you started with, leading
              to higher yields and lower network fees, which are collectively shared among
              Harvest&apos;s users.
              <br />
              <br />
              Moreover, Harvest&apos;s expert contributors have been researching and crafting
              high-yield strategies since 2020, ensuring you have access to cutting-edge
              opportunities.
            </DescText>
          </WrapperDiv>
          <WrapperDiv>
            <Title>What do I need to get started?</Title>
            <DescText>
              To get started with yield farming, you need two things:
              <br />
              <br />
              1. A non-custodial wallet such as{' '}
              <a href="/#" target="_blank" rel="noopener noreferrer">
                MetaMask
              </a>
              {', '}
              <a href="/#" target="_blank" rel="noopener noreferrer">
                Rabby
              </a>{' '}
              or{' '}
              <a href="/#" target="_blank" rel="noopener noreferrer">
                Coinbase Wallet
              </a>{' '}
              - either a desktop browser extension or a mobile app.
              <br />
              2. Some crypto - as low as $10 in USDC or ETH is enough to start!
              <br />
              <br />
              <div className="italic">
                If you have funds on a crypto exchange like Coinbase, Binance, or Kraken and
                don&apos;t know how to transfer them to a non-custodial wallet other than Coinbase
                Wallet, please look for help on the support page of your wallet provider or join our{' '}
                <a href="https://discord.gg/gzWAG3Wx7Y" target="_blank" rel="noopener noreferrer">
                  Discord channel
                </a>
                , where our mods will be happy to help.
              </div>
            </DescText>
          </WrapperDiv>
          <WrapperDiv>
            <Title>Your first farming experience</Title>
            <DescText>
              We have created a special Beginners section where anyone can start yield farming in
              just a few clicks.
              <br />
              <br />
              Open{' '}
              <a
                href="https://app.harvest.finance/beginners"
                target="_blank"
                rel="noopener noreferrer"
              >
                app.harvest.finance/beginners
              </a>{' '}
              to see the following section:
            </DescText>
            <DescImg src={FirstFarming1} alt="tutor" />
            <DescText>
              In the top-left corner, the [Connect Wallet] button prompts the following modal to
              select the wallet.
            </DescText>
            <DescImg src={FirstFarming2} alt="tutor" />
            <DescText>
              Once successfully connected, our wallet address is displayed in the top-left corner
              alongside a green dot confirming the Connected status and the connected network icon.
            </DescText>
            <DescImg src={FirstFarming3} alt="tutor" />
            <DescText>
              Before continuing, let&apos;s switch to Base Network.
              <br />
              <br />
              It is essential as the{' '}
              <span>Beginner Farm can only be used on the Base network.</span>
              <br />
              <br />
              If you&apos;re not connected to Base yet; here&apos;s how to switch networks directly
              via Harvest App:
              <br />
              <br />
              In the top-right corner, find and click on this icon:
            </DescText>
            <DescImg src={FirstFarming4} alt="tutor" />
            <DescText>
              Under &quot;Current Network&quot; unroll the dropdown menu and select{' '}
              <span>Base Mainnet.</span>
            </DescText>
            <DescImg src={FirstFarming5} alt="tutor" />
            <DescText>
              That&apos;s it! You&apos;re now connected to Base Network.
              <br />
              <br />
              For the purpose of this tutorial, our wallet balance is topped with around $250 worth
              of ETH. A reminder that it&apos;s possible to get started with far smaller amounts
              like $10.
            </DescText>
          </WrapperDiv>
          <WrapperDiv>
            <Title>Getting started with Yield Farming</Title>
            <DescText>
              To start yield farming, we need to convert any token from our wallet into an
              interest-bearing token of this farm.
              <br />
              <br />
              We will do it via a dedicated Convert box, which is highlighted below.
            </DescText>
            <DescImg src={Convert1} alt="tutor" />
            <DescText>Let&apos;s take a closer look:</DescText>
            <DescImg src={Convert2} alt="tutor" />
            <DescText>
              The Harvest app automatically detects ETH and other popular crypto tokens in our
              wallet and sets it as the Input Token.
              <br />
              <br />
              Having that, we can see the USD value of our ETH in the input field to help us
              understand what kind of sum we are starting with in USD realms.
              <br />
              <br />
              Underneath, we can see yield estimates on our Input token. In other words, Harvests
              give us a clue of monthly and daily yield that can be expected if we proceed.
              <br />
              <br />
              Lastly, the <div className="label">Est. fTokens Received</div> label informs us about
              the number of units of the interest-bearing fToken (in this case, fmoonwell_WETH)
              we&apos;ll receive for our ETH.
              <br />
              <br />
              Alright, let&apos;s click on the Preview & Convert button to be presented with the
              following modal:
            </DescText>
            <DescImg src={Convert3} alt="tutor" />
            <DescText>
              Here, the app reminds us of the amount of ETH we are converting, its live USD value,
              and the number of fTokens we are about to receive for it.
              <br />
              <br />
              <div className="note">
                Note: Minor fluctuations of the USD valuation between the input token and the fToken
                are to be expected as they are subject to market volatility.
              </div>
              <br />
              <br />
              Alright, let&apos;s click on [Approve Token].
            </DescText>
            <DescImg src={Convert4} alt="tutor" />
            <DescText>
              <div className="note">
                Note: In this tutorial, we use ETH, a native token of the Base Network. After
                clicking on the Approve Button, the progress bar will instantly move to the next
                step.
              </div>
              <br />
              <br />
              The wallet would ask us to confirm the token approval if we use any token other than
              ETH.
              <br />
              <br />
              Alright, moving on to the next step. Let&apos;s confirm the transaction!
            </DescText>
            <DescImg src={Convert5} alt="tutor" />
            <DescText>
              In this final step, the wallet will ask us to confirm the transaction regardless of
              whether our input is ETH or any other token.
              <br />
              <br />
              After hitting the Confirm button, the Base Network sometimes takes one minute or
              longer to process our action.
              <br />
              <br />
              Next, we should see the app&apos;s success message and confirmed transaction info from
              our wallet.
            </DescText>
            <DescImg src={Convert6} alt="tutor" />
            <DescText>
              Let&apos;s proceed by clicking on the{' '}
              <div className="label">Success! Close this window.</div> button.
            </DescText>
          </WrapperDiv>
          <WrapperDiv>
            <Title>Understanding yield returns</Title>
            <DescText>
              After converting ETH into interest-bearing fToken, we are presented with the following
              state of the farm&apos;s dashboard:
            </DescText>
            <DescImg src={Yield1} alt="tutor" />
            <DescText>
              In the <span>top-right</span> corner box, we are presented with the number of
              interest-bearing fTokens (see: Balance) we hold in our wallet and the corresponding
              number of ETH (see: Underlying Balance).
              <br />
              <br />
              In the <span>top-left corner,</span> we are presented with the live market valuation
              of our Underlying Balance and live yield estimates based on the vault&apos;s displayed
              APY.
              <br />
              <br />
              On the chart, shortly after converting into fToken, we are presented with two straight
              lines:
              <br />
              <br />
              <ul>
                <li>Green line corresponds to the USD valuation of the Underlying Balance.</li>
                <li>
                  Purple line is the most important one to watch, as it represents the number of
                  units of the Underlying Balance, which increases with every auto-compounding.
                </li>
              </ul>
              <br />
              <br />
              We are yet to experience our first auto-compounding event and markets haven&apos;t
              moved much, hence the lines are completely straight typically for the first couple of
              hours since converting.
              <br />
              <br />
              How frequent is the auto-compounding for this farm?
              <br />
              <br />
              Let&apos;s head over to the <span>Farm Details</span> tab, where we&apos;ll be
              presented with the farm&apos;s SharePrice, which, by default, reflects its performance
              since inception.
            </DescText>
            <DescImg src={Yield2} alt="tutor" />
            <DescText>
              In the top right corner, we can see that the Last Harvest happened around 9 hours ago.
              <br />
              <br />
              The auto-compounding events in the Beginners farm happen at least once a day.
              <br />
              <br />
              This means that to see the first signs of the benefits of using Harvest, the
              performance chart can take up to 24 hours to produce a visual uptrend for the purple
              line.
            </DescText>
          </WrapperDiv>
          <WrapperDiv>
            <Title>The Next 24 Hours</Title>
            <DescText>
              Let&apos;s take a look at how our farm performed overt the last 24 hours!
            </DescText>
            <DescImg src={Yield3} alt="tutor" />
            <DescText>
              We can clearly see that the purple line saw two auto-compounding events since we
              started! The number of ETH units in the ‘Underlying Balance’ has increased.
              <br />
              <br />
              At the same time, we can see how the green line (USD value of our ETH) fluctuated due
              to market volatility.
              <br />
              <br />
              Fantastic!
            </DescText>
          </WrapperDiv>
          <WrapperDiv>
            <Title>Tips and extra notes</Title>
            <DescText>
              <span>#1 Performance chart timeframes</span>
            </DescText>
            <DescImg src={Extra1} alt="tutor" />
            <DescImgText>In this picture, the timeframe is set to [All]</DescImgText>
            <DescText>
              We can preview the performance of our funds in different timeframes. By default, the
              chart is set to &quot;Last,&quot; which uses our latest action, such as converting
              more tokens, as the starting point to give the best insight into the latest
              auto-compounding events.
              <br />
              <br />
              <span>#2 Understanding My Balance</span>
            </DescText>
            <DescImg src={Extra2} alt="tutor" />
            <DescText>
              It is important to note that this box provides a live valuation on our Underlying
              Deposit, which is constantly exposed to market volatility (even in stablecoin farms,
              My Balance and the green line on the chart can fluctuate by a small margin).
              <br />
              <br />
              At the end of the day, Harvest auto-compounds ETH into more ETH units for farmers
              using the Beginner farm.
              <br />
              <br />
              <span>#3 Get started with any token from the wallet</span>
            </DescText>
            <DescImg src={Extra3} alt="tutor" />
            <DescText>
              By clicking on the [Input Token] button in the Convert box, we are displayed with a
              list of tokens in our wallet and other popular tokens that can be used as an
              alternative token to get started with farming.
              <br />
              <br />
              In other words, we can start farming ETH using USDC or DAI.
              <br />
              <br />
              <div className="italic">
                Note: It is possible to convert and revert tokens in this farm anytime. There are no
                timelock or other requirements.
              </div>
              <br />
              <br />
              <span>
                Needs help? Join{' '}
                <a
                  className="classic"
                  href="https://discord.gg/gzWAG3Wx7Y"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Harvest&apos;s Discord channel
                </a>
                , and our contributors will be there to assist you.
              </span>
            </DescText>
          </WrapperDiv>
        </CoinSection>
      </Inner>
    </Container>
  )
}

export default Home

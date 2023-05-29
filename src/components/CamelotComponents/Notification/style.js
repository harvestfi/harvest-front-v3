import styled from 'styled-components'

const NotificationMain = styled.div`
  margin: 9px 13px;
  background: linear-gradient(45deg, #ffac39 0%, #ffab36 100%);
  box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  border-radius: 12px;
  padding: 12px;

  display: flex;
  justify-content: space-between;

  .left-part {
    display: flex;
    width: 75%;
    margin-right: 15px;
    img.main-img {
      margin-right: 16px;
    }

    .main-desc {
      align-self: center;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: white;
    }
  }

  .right-part {
    display: flex;

    .announcement {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #ff9400;
      background: #f9f5ff;
      padding: 10px 18px;

      border: 1px solid #f9f5ff;
      border-radius: 8px;

      &:hover {
        color: black;
      }
    }

    .close {
      cursor: pointer;
      margin-left: 15px;
      margin-right: 15px;
      align-self: center;

      width: 20px;
    }
  }

  @media screen and (max-width: 1150px) {
    .left-part {
      .main-desc {
        font-size: 10px;
      }
    }
  }

  @media screen and (max-width: 992px) {
    margin: 5px;
    .left-part {
      align-items: center;
      img.main-img {
        margin-right: 7px;
        width: 21px;
        height: 21px;
      }

      .main-desc {
        font-weight: 600;
        font-size: 10px;
        line-height: 14px;
      }
    }

    .right-part {
      .announcement {
        font-size: 8px;
        line-height: 14px;
        padding: 4px 7px;
      }
      .close {
        width: 10px;
        margin-left: 7px;
        margin-right: 0;
      }
    }
  }

  @media screen and (max-width: 500px) {
    .left-part {
      .main-desc {
        font-size: 7px;
      }
    }
  }
`

const Icon = styled.img`
  filter: invert(100%) sepia(2%) saturate(66%) hue-rotate(51deg) brightness(113%) contrast(100%);
`

export { NotificationMain, Icon }

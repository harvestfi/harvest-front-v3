import { handleViemReadMethod } from '../..'

const getReserveData = async (asset, instance) => {
  return await handleViemReadMethod('getReserveData', [asset], instance)
}

const getUserAccountData = async (user, instance) => {
  return await handleViemReadMethod('getUserAccountData', [user], instance)
}

export default {
  getReserveData,
  getUserAccountData,
}

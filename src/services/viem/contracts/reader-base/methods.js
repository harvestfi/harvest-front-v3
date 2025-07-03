import { handleViemReadMethod } from '../..'

const getAllInformation = async (userAddress, vaults, pools, instance) => {
  return await handleViemReadMethod('getAllInformation', [userAddress, vaults, pools], instance)
}

export default {
  getAllInformation,
}

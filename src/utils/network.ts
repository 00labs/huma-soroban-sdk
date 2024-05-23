export enum StellarNetwork {
  testnet = 'testnet',
  mainnet = 'mainnet',
  futurenet = 'futurenet',
  localnet = 'localnet',
}

export enum StellarNetworkPassphrase {
  mainnet = 'Public Global Stellar Network ; September 2015',
  testnet = 'Test SDF Network ; September 2015',
  futurenet = 'Test SDF Future Network ; October 2022',
  localnet = 'Standalone Network ; February 2017',
}

export enum StellarPublicRpcUrl {
  mainnet = 'https://horizon.stellar.org',
  testnet = 'https://soroban-testnet.stellar.org',
  futurenet = 'https://rpc-futurenet.stellar.org',
  localnet = 'http://localhost:8000/soroban/rpc',
}

export enum POOL_NAME {
  Arf = 'Arf',
}

export enum POOL_TYPE {
  Creditline = 'Creditline',
}

export type PoolMetadata = {
  poolName: POOL_NAME
  poolType: POOL_TYPE
  contracts: {
    humaConfig: string
    poolStorage: string
    pool: string
    poolManager: string
    poolCredit: string
    creditStorage: string
    seniorTranche: string
    juniorTranche: string
  }
}

export type NetworkMetadata = {
  network: StellarNetwork
  networkPassphrase: StellarNetworkPassphrase
  rpcUrl: StellarPublicRpcUrl
  pools: PoolMetadata[]
}

export const NetworkMetadatas: NetworkMetadata[] = [
  {
    network: StellarNetwork.testnet,
    networkPassphrase: StellarNetworkPassphrase.testnet,
    rpcUrl: StellarPublicRpcUrl.testnet,
    pools: [
      {
        poolName: POOL_NAME.Arf,
        poolType: POOL_TYPE.Creditline,
        contracts: {
          humaConfig:
            'CD6E7GFRHBQ627ZXK5YNMQFBBLFCXBBEU6VYXBSQ77CYOYQC5UV3HS76',
          poolStorage:
            'CAKPKH2G3ALGKW2E5BJFUJ6WR3RXJVGIXEAPVI5S6Q4HKSDCMKEYJSBR',
          pool: 'CC2GGLIHX5E75QIXB7G27EOC47V74PXA33KGYDQH4DFISIVZPWQRBVJV',
          poolManager:
            'CC7TGDDRSA2R7F6RIW3POEZSH22RG7DYNZX6GY2YGQ2O33E5BZWSMPDT',
          poolCredit:
            'CBI7LGEWCJFO2APREGBRTUXB5JMZHJOVD76MESEB7V6W4IJ4ZLQJILDB',
          creditStorage:
            'CCQMDMB2J6XRPZKG4QYNSXNN6W56HH5QCQXM6MDIW7ZEJRYSLL2ZEG2U',
          juniorTranche:
            'CDXI5L5EFHBW3KYY3D6JGXJTGDOG5EZAQUDAK5LWZQVH4TEUDAO7PBGU',
          seniorTranche:
            'CDFZVYABKBUBCNBW4NLTZ63JWPZFE677PQOXRZLBCKSY6MDB5CHR2IJ2',
        },
      },
    ],
  },
]

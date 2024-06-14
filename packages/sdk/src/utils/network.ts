export enum StellarNetwork {
  testnet = 'testnet',
  mainnet = 'mainnet',
  futurenet = 'futurenet',
  localnet = 'localnet',
  humanet = 'humanet',
}

export enum StellarNetworkPassphrase {
  mainnet = 'Public Global Stellar Network ; September 2015',
  testnet = 'Test SDF Network ; September 2015',
  futurenet = 'Test SDF Future Network ; October 2022',
  localnet = 'Standalone Network ; February 2017',
  humanet = 'Standalone Network ; February 2017',
}

export enum StellarPublicRpcUrl {
  mainnet = 'https://horizon.stellar.org',
  testnet = 'https://soroban-testnet.stellar.org',
  futurenet = 'https://rpc-futurenet.stellar.org',
  localnet = 'http://localhost:8000/soroban/rpc',
  humanet = 'https://dev.stellar.huma.finance/soroban/rpc',
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
    creditManager: string
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
            'CAHPEHOIZIIMMTFCZOYEXDKHXJZ2QDYLRD3SF2AZTXWAUV4OWKGHPDCL',
          poolStorage:
            'CDL3YWC2SMRK363QPS4AR5TGVFESE3FMIPOGHEQBMJJA3RTQQ2ALW73U',
          pool: 'CCUM2YAJM3EY2RTFMX5P6PDBT7ZZWPNNQLMW4CGIGQJKLTLT7J2SMAMV',
          poolManager:
            'CDPNNXOD6LVIXD2VYAH6CKQ6TPQYDITGJ4END7LFLR7OIZNHLCWLF347',
          poolCredit:
            'CCRLVVJOUF5MHMKJ36YWRCKPK7YUVDHA7ZNEL6EDSU2LUDHIOMN65S5G',
          creditManager:
            'CASGH7RO7Q4H3JOMACIFKIVZDIL7AFHYELXB5JQ6VWTMQ7IMO6GEBRQ5',
          creditStorage:
            'CAWXNUPJVXSPZ4WSWURNYYPECL3GDPLLP7LSSBMRXMDGWZ4ZXNIHMITS',
          juniorTranche:
            'CAX7J3ZANVPKCW4YSTWUBOUNO667MLH2FQGDURE4RPPI5BWPAO6WCSKZ',
          seniorTranche:
            'CAX34UNMKDDDO7IFQO7VZ43UYYWLUILLMU52HDGBBDQFYGQQUCYASOWH',
        },
      },
    ],
  },
  {
    network: StellarNetwork.localnet,
    networkPassphrase: StellarNetworkPassphrase.localnet,
    rpcUrl: StellarPublicRpcUrl.localnet,
    pools: [
      {
        poolName: POOL_NAME.Arf,
        poolType: POOL_TYPE.Creditline,
        contracts: {
          humaConfig:
            'CAYSSYDIRAFM4FIZ2RFGCCLUJZODOEGPB3GYE5ECIMOAUZKWHTR33UK7',
          poolStorage:
            'CBUPUVI4HVE6DY2QGISUP72Z77E3QFWCKMJBMOYI27MGG6E5UZCSEDQU',
          pool: 'CASFU6P33UERVBV7XSWJ6JHKTLZBAYL2UEWRSP77V4F27OHXS4O4OHML',
          poolManager:
            'CDBZYAXIHNGPRAHOQU53AILDMSUO5UENFSCNHNT2ABXGLC2MEJ6RPV33',
          poolCredit:
            'CAC6ZM2HT2JVNS3TZ2LYVJ6JDR724J2SOV63YIWMP2RSLYA64EB5C7JH',
          creditManager:
            'CAC6ZM2HT2JVNS3TZ2LYVJ6JDR724J2SOV63YIWMP2RSLYA64EB5C7JH',
          creditStorage:
            'CCPTCRU7FUVQLNR4GGUBWQDHJCQTW3MXDZQYQQGB4OC2PNME7HNIV3R3',
          juniorTranche:
            'CD4TNCKN7PDNOBS2JHEXRXPHOL327EX4Z7EURDG2XFWBZ67XG5XW5Q7O',
          seniorTranche:
            'CDOB4BPE2AKSZYW27QP4IYVIIGVQD3C7E7YL6XRZ2ANM7MYJT2TKOVPC',
        },
      },
    ],
  },
  {
    network: StellarNetwork.humanet,
    networkPassphrase: StellarNetworkPassphrase.humanet,
    rpcUrl: StellarPublicRpcUrl.humanet,
    pools: [
      {
        poolName: POOL_NAME.Arf,
        poolType: POOL_TYPE.Creditline,
        contracts: {
          humaConfig:
            'CBGPX6WVVGCGM5DKWCJJQ5BPNHGR6ZLF2SQ3T7AEY4HYSLBXGSIEGVR3',
          poolStorage:
            'CAVB4VDYIDV44RUVDA4YPBFHGLTFULWAWMJIJ5VGES4U3MXODUGIMBYL',
          pool: 'CB4IXNZI5ORKF3CS5U3MSYXPTW5DFYTZ4UZKG6VR4ZCSBTGSFTFT4F72',
          poolManager:
            'CC3ZYVJ4AYSEIR5KWFW7MEPM5TC6S5HL3SNE6UO5TLIEN3O4MGK3D7DA',
          poolCredit:
            'CBCI554AHAGGLM2PU6OHROODQACCZJYCYGWIKXF3JQ4SIA5O7XFBCS7C',
          creditManager:
            'CAZRM7LLCFNDHQP7P5H6KK7WSG2GDP7EFIL2B3IPAY4JOGC2E747CMFJ',
          creditStorage:
            'CCNDNBGKZ2EI6HXUVCJDXHDTXO55TCN3HHHMGJZYQRJIIM3KVYXJKYON',
          juniorTranche:
            'CDOSQ5336AWKTHBM6OMKKLGLS6IJMSTI6IOZWZSGB5LZA3MAEI62LROP',
          seniorTranche:
            'CABKIDZXNO6JYO5UZYXL4HWVLTWVJGNM6BC4JGL5PDJFSZSVMNU2DENU',
        },
      },
    ],
  },
]

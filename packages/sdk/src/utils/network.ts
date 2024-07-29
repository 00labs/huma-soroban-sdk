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
    juniorTranche: string
    seniorTranche?: string
  }
}

export type ContractType = keyof PoolMetadata['contracts']

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
            'CBPPUTDLFGA73HFDLT45EXS2MBUK3ISNRM3CRJ5AGPQS2MY3JIWCNZ5R',
          poolStorage:
            'CAV6Q25V3HFVCU5NGCHMVRHXD6IOU5HZNB453VH3CJIQ4E55RM7QU7I4',
          pool: 'CCKEISAFFQIB44Y4OMOSDRXNSFBS5CBJHLPE2YU6INHU2IMWQDXOYW3H',
          poolManager:
            'CDHPUBZZZHCLZ7DC42EMRUJTEXRW7R3IX2VBYM7NUNFCT3BMLWWWZJG3',
          poolCredit:
            'CAEGLPFETWBCFSKIKFPN7VY6SRAQHLW42N6FFJ6IRO6IBEECVVJQKHQ7',
          creditManager:
            'CAF346JT7XMFUZWHX2QKDIHDBQMMZOUPVA7Q4C2PRP7HOO6SMOGPKC7F',
          creditStorage:
            'CDXG5THQJWEKY6XO6VH673J5KYUAU5Q2FPGLWO4YM2TXYMXEOEQOE4DZ',
          juniorTranche:
            'CCDCJ5PYATGWFBNSVISW5B4GMSOTJSMK2T7TOB6XLIUA66OCSGPKB3RV',
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
            'CCEI7LEMN2PT47VV6HMQDJI4UC25M2AT33IDMAZFPRH64GYG5WE266SW',
          poolStorage:
            'CDDNEIRXEFRDPRJP7MJ3TBCAG4ZG6X7V3TAZYOZSDSCQ3PNA6CUPGTF6',
          pool: 'CBX53HW254W3ROTSVZSZ7RM3RVAFGCPTZFEE4RURXHHYOL2VDVGUOVWU',
          poolManager:
            'CAJJ75TGZYB2QXPF7PQQR43IRGEN4A3MXKGZWVIZESLNDGDU22FB6DRM',
          poolCredit:
            'CBZ7UQSPU5DEX6I7ADGLRYB2YWJOF3XUYXRILPKYZDBBXBZC5EORZ3AM',
          creditManager:
            'CDSF3EVJAJOA7L4GNL2MUZBB4BPTOKZW2USXTUEWYD7W5H5HW6WUGMVA',
          creditStorage:
            'CB7KFMFHVENKUMLB3QYRGMLFQMJ5IPIEBLKOMWXYLRY537EHNAON6U56',
          juniorTranche:
            'CBDPTKXAOUVRUCGPUJKRZGL3AKZVEOPUR5BFNRAHTJSI6WOUZLXU4KXP',
          seniorTranche:
            'CBM2QHAXIELWLDITPPXU4ILWOFKA6RLO4M5OSJJS4QJNWDU5L7CSKJUP',
        },
      },
    ],
  },
]

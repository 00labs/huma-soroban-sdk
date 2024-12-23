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
  mainnet = 'https://soroban-rpc.mainnet.stellar.gateway.fm',
  testnet = 'https://soroban-testnet.stellar.org',
  futurenet = 'https://rpc-futurenet.stellar.org',
  localnet = 'http://localhost:8000/soroban/rpc',
  humanet = 'https://dev.stellar.huma.finance/soroban/rpc',
}

export enum POOL_NAME {
  Arf = 'Arf',
  Roam = 'Roam',
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
    underlyingToken: string
  }
  borrowers: string[]
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
    network: StellarNetwork.mainnet,
    networkPassphrase: StellarNetworkPassphrase.mainnet,
    rpcUrl: StellarPublicRpcUrl.mainnet,
    pools: [
      {
        poolName: POOL_NAME.Arf,
        poolType: POOL_TYPE.Creditline,
        contracts: {
          humaConfig:
            'CAVRWN3JYHZLKREHPDXFRCMEXPLPF2LIYRWKBHIRWSE62OCRTELBLQ4O',
          poolStorage:
            'CBIJ2WP7TTSMINHJRUX52YR2T3YOD7T2X4335PW3DS4GIOOJ5JQT5WF2',
          pool: 'CAOYBU6OQWAF3OZBHW5N6ID7TPAKZBJ27XR63IGTXMWEI3NSNTCYI6SH',
          poolManager:
            'CBQ7KII3OETETYM65TFJT2YPVFFK42V4WUBIMJJNWKTIZ5XOWYZW3XAO',
          poolCredit:
            'CANCNGJEAAN4GS6WVI3OAFWD2IAJW6WMI7TOD4UHC623QTDMD3LVTN3G',
          creditManager:
            'CD7FKCTK2Z3KX7RZEEKD632RIR7J65KALICV6G7W4UPRMF65RNXAT5AM',
          creditStorage:
            'CB6W2Z5ZRKLUL5A3OIHD7IAYMFLNRJ2VHFEXG7TSBB4LFE3YYSJII5JG',
          juniorTranche:
            'CCHQ5HEKNHCH3LUQ3B73VJRDHNSKOUL567VB3HMOJ7M7BI4QVZ7WCQCL',
          seniorTranche:
            'CAEVE6BJIXQV54DGNFZ5GRIMIIITAHXSOWTGKTDZCQZA4FXK4ZNDZYFX',
          underlyingToken:
            'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
        },
        borrowers: ['GBQ4MIGKASCJG4GNEOQ3G6Z6YDUXCAKYARB3MNJ7QOF54MNMYW7HP62V'],
      },
    ],
  },
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
            'CAAVSHWNTUFIZCKCCXRDRFRRUDEBTKNRWBPHHOA4ZIYD3ELAOY4LOHUY',
          poolStorage:
            'CCIMD2GVMKRK5UNOD7JJSM74HFLOFJ6ODAXY2OQBA46JQ4QYAZ4P34EF',
          pool: 'CCXBTYYRX3TALCODB7SWOJRPREXJYPCRZMVKSTXSTVQYB2AV5BF6HL44',
          poolManager:
            'CB334NWVJ4SDD3ON6H2WRE2K57NCETY3NJVUSBVWSVTT6ATB4ADMWJED',
          poolCredit:
            'CDCNJDPWCGLSOD3W2W3G34XILCIF7WPBG2SCXHTVSTJL4QGD4HFWBZFM',
          creditManager:
            'CDY6NTTINATBCG7TOVXB23XFRDES4QBR4CF2375YZEYKVNJZJR423ITR',
          creditStorage:
            'CBXWR7FOC4IQHGGTSF7OHNQAGBACVTY7U6SR6LPDXWE3F4S74MOF3JDR',
          juniorTranche:
            'CBN6KKNSWJLYVQS3YPX4FK7DJZGTSRTCQN52FX2CZ342EC7LWHWJFBHH',
          seniorTranche:
            'CADMAL7SRLFVF2JI7RJZY6UTIZBPZUT7NBTMWXSCH255JK3LLWQHU5Y3',
          underlyingToken:
            'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
        },
        borrowers: [],
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
          underlyingToken: '',
        },
        borrowers: [],
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
          underlyingToken: '',
        },
        borrowers: [],
      },
    ],
  },
]

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
            'CCAIHLSVRKOU4XM2UWLBXRTWX3C2SFKZTCZ7ZDWSOWPHRAL4LVONLZSF',
          poolStorage:
            'CDETZGJWZZFLXSO5AJ5S5EWUQPJUKS2KSYIWTQNH5ZADJMSYXQVE6Z6Y',
          pool: 'CCIH4TXFY32NM4CN5G5MVJHLIMLUZUJ72TUH3PWO7T7RDMYFIS6ME6LI',
          poolManager:
            'CCM4GBO7FW3EABFPLYBPU4GW6IPCSDUEET6WFW253IQIJ4MXYLUCXVAF',
          poolCredit:
            'CAJ6TKKHCE7Y7LIMPNTG5XZYYK7IZYAWRT2BOSZCKOZZCPX3RBZONPFJ',
          creditManager:
            'CCV47GK54O67WKCV4SQ6ZRCCQFZAUBKBOIYC6GENWDMCOJE7K2VYGVPI',
          creditStorage:
            'CCAGR4BX7NGUUVD55B7DCKH2ZY4ISYCHMWNVEA63AKUXAESHJTRNWDTB',
          juniorTranche:
            'CDHZGXZLW3Q2MJOC6RB4IYOSGI7P3T2AEE6DAIS4ATMOXYHHDQ5G5UWG',
          seniorTranche:
            'CAEGT76URZASBOLMWNASRDPMWM3TELHTH7CEZEMRJRTT3GO6HJCW4HSU',
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
        poolName: POOL_NAME.Roam,
        poolType: POOL_TYPE.Creditline,
        contracts: {
          humaConfig:
            'CDX6NBJ3OV4TWRCZK4DFBHDHE37UUDS66PPGNIPBGUI56D254EKVFETX',
          poolStorage:
            'CBA35JCIXFRAEPRVD3JAQ5WLC7SYZP3RABUKJ52LU5EI2YQ6CDNIAQZF',
          pool: 'CBAJF4BORH2YLIZH4QQSBGDD62VVUKVTNESXRV7KVXTSQ2X4WWP2M3NC',
          poolManager:
            'CDLLMPQMNIT7HE2Q6PGVSWYKAE7FLUHVM4QYV7D4ISLT3GD4XZDVSBXV',
          poolCredit:
            'CDPYWOCBSXC3W6BYRKO645OQLJNDDZ2EDSZ2Y547BL4LHMSRU7FUVTVG',
          creditManager:
            'CBEH5SKVKC6GXP5FQLAUFX43GAFRXZDOHDUQW3CRFD5BQVH7L6YSBP4V',
          creditStorage:
            'CADDOLDFYN6Y2DXNYMX2ILVLPLU5W7MAQ7GBOOYWJ6JCH4DGHLUH2FB3',
          juniorTranche:
            'CB6K4IUC3CJHIWVHHLBDTGXVS6CT64EKGD5CGBIDNMSAKVZHCWQ3LM2D',
          underlyingToken:
            'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
        },
        borrowers: [], // TODO: Replace with Roam
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

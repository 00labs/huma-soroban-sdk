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
            'CAXZGMU3EHOHGXGXDJWVPG5PIVC2DCZQ2JO2YI3RGSM4OQK7ZIQ46FV5',
          poolStorage:
            'CAADAYJOZF5HXPVZXBXA3PLCU7OSRW34OKVXG2676KAGZVZBI6EYQ73L',
          pool: 'CDVJY4NLTSKNLHO2JIRKDERE366WYG3OSJY42VOLI7DBAX4X5Q2BY75O',
          poolManager:
            'CBFX4CMIWVOVFTJCRC5BYTBOXBZVJXNUI2D5UWM6WP4J2VBXRFYV4YQC',
          poolCredit:
            'CC34OGI32WJDSGFES3HWSETSKPN5BQLDEYFHFTDVTUEL2HZLJG5M2UAJ',
          creditManager:
            'CBX7MQGXQN6DHGDDRARUH266PIIDTFB5H5HVFPFL365V2JJPX2OWZOZT',
          creditStorage:
            'CCXOG76F7A67FHR5OVJPGUVLHF55VOYJZADWEQDDMVLR66R3ODNRAIEP',
          juniorTranche:
            'CDJ6AO57ZWBIDITDN32URXYQY6MTSFBNF6OFOCENRDE2MUB67UZKLKDP',
          seniorTranche:
            'CB7ZHYQW72JW4GA7ZGGZZQQSXC4H7QRJK6CA5JLQCOZKLL2YMSABKQNX',
          underlyingToken:
            'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
        },
        borrowers: ['GDKMQ74NKGAOUCVPQ26A2IYFVKU5VUKCC364RIHDTG3AQ3GC73B3YTOT'],
      },
      {
        poolName: POOL_NAME.Roam,
        poolType: POOL_TYPE.Creditline,
        contracts: {
          humaConfig:
            'CAXZGMU3EHOHGXGXDJWVPG5PIVC2DCZQ2JO2YI3RGSM4OQK7ZIQ46FV5',
          poolStorage:
            'CAB53KIRFB6S5AB73NCCLKM5XMYTKD75RL3FGVG5ZKDUQBGVUIK4ZRDC',
          pool: 'CCCWIFYK57JQJ7PUE5OCH7KIG4LJECSAUL6VCOB3RYTH3G7LK5XWUPLV',
          poolManager:
            'CAA5V7EUL54JWLZMM5ZW4UMNFFWIEQAB74QZ7BFPDS4TU3YGURNB7X3O',
          poolCredit:
            'CDLV3BYERCMZ6GA2K7N737SSS7OCOMDG4YQOK3L7ECBQF3QSYWJ64KPU',
          creditManager:
            'CBOBDST2PFMLN6CP6KP3TA67NV7AM3AURTUQ2UFCO6QTUGNAQKSIWYKE',
          creditStorage:
            'CDVTUZZPATZD236WX3RQF57WWBGU74OMEUXJZQ3LTT6H5SCZVFTFV3ZD',
          juniorTranche:
            'CBT55AVA4MM5DLYJA7KW23GQY64KGOTQF5ELEY7CMYJ6TDQ43QMPEF7B',
          underlyingToken:
            'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
        },
        borrowers: [],
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
        borrowers: ['GCI3WLD2P3OHSMMDZU6X2FMSRHFXOI6JCH5HQK5GBRN5Z2NVMOJMBIDV'],
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

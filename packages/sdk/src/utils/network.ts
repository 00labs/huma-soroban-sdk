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
            'CDEH36NMZK6AV5I675A2BSRIWLJGBVXWN5HHABKJKHNIGKSKJQVXPXFB',
          poolStorage:
            'CBHY4NM3DVEBX3QTL3X5XEOAKHDMP44HDP7SBDTCOAMFU7LFIBMFEV4N',
          pool: 'CAI6UQAXZ6ICE5QQ4WFEEDQLZORGMYBCL2RB2NVY6AGMH4XT6PCH7IPX',
          poolManager:
            'CCTCNYWWKPVFNPJDQUMJM6GFBU6IJSZH6CHPM5COJTBMWO64A4XVCXNV',
          poolCredit:
            'CCYWDOW34SPB3FCR6A633B5GS5DPRRQKTTCT4DU7YYFDRT7XBOA2HYYY',
          creditManager:
            'CDHYIC3ISV3F3RL7FROC3SI2GW65ZOJHMA2AMZJYLIRLWSDELFF3CR23',
          creditStorage:
            'CBZHE4LD4FYGELCFDVRNBLNO4743X4UJDIDC7CGYS3MLJ3CIHC4SGLHC',
          juniorTranche:
            'CAJZ4V2N5TOJ6GVOJOKTJSP3QYDNVC6O6TDO2V64GULQGZNRRFM5AS7V',
          seniorTranche:
            'CBQV4USFV4MBZTKK6W6SM576GVBZGZZHEHT7Y2OVIKNYG45L57LDL6SA',
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
            'CD35X6V3O5BVFWYGETHIHRWPJIWYIA3MYHHULBUJLMD4INX6Y34DW3EG',
          poolStorage:
            'CARX3M7LZM4QPPR65OGGY36GKEVD2LNV6I7IMB5EHE77XUAQXZHTKX6S',
          pool: 'CBB6RMWO2YBVSV66ZTBXZWEWKEFTFDP4K5YPV6KEMVZN26DNDXQI3JEO',
          poolManager:
            'CB6OOMIMGLDYYPI7QEJFKMNZEBMAZG5IF2SK7VTL5B4KE2KJVYKIIZOS',
          poolCredit:
            'CBB2X44GZCH2NMW7HQ53PAURLKQT2DOZVIQ3PWYY3YGQIOOUNAV5QACI',
          creditManager:
            'CBN6JIEPA4QQKANLMEUICLK24NBEWIG7TPIRGEXDT32WHYLBNHQU67CR',
          creditStorage:
            'CBXVWUFZU65MJZWFDMZSRSA6LPRVAUSOYCMVC3YJJXX32TH35MXUZJTN',
          juniorTranche:
            'CBWSIQMVG5VVUBTRFGAAXNZQ4AMRVYK2VN3346EP3JYPDZXT6VEOQEK2',
          seniorTranche:
            'CBSPGT3IW3PS2CIKVHZKPNA2KZP6EAXFZ3AH4LQ6HN252GGJKBNSIUAW',
        },
      },
    ],
  },
]

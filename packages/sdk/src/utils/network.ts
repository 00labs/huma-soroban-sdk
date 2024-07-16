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
            'CD3PTHUCY7ZNJNORNBLFFE2MV7FLMWKROL3LI7CYP4HN3J7YUGEESKPG',
          poolStorage:
            'CATMF6H4L7FSCTOUXXHABCU7F43KMOHQXXLEWTQYDWYG4NVHUHXX57X7',
          pool: 'CCEKIKO4HHVEOUJGSJEF46LPVBV27IDFOYEEVY4T7O2BLNFRGY52CEIA',
          poolManager:
            'CBDK46UHXA5F2AO7IFBZQFF6KWIAPG4ORKGEVLK5J5DAAR5BUVHXQACN',
          poolCredit:
            'CAUO7YZB5423R2GOTKP6ITBRFNMZNOJVAS3CV3BL4T6SQAI4CE3T7QYF',
          creditManager:
            'CA3IRZTBAC2PHZLE7Z4WQBJXE45T2JREUEVIEKIGS5AJX5BB4XRXGYQ2',
          creditStorage:
            'CDY4MM6CQSVHTSKQFDOHQLNH3NSJIGWFSDUKHJV4YOVMY3OIGPYLTRYD',
          juniorTranche:
            'CD6K6EUK4MZGDKVXTRXY2GKK6MQYIVTLUMMVDF4VZNBFHG4MLNZM5WVZ',
          seniorTranche:
            'CA74FMSH262GZSS4V2NED6DIUOXFTTGB7PRYLR727DNM6HTT464KEMUZ',
        },
      },
    ],
  },
]

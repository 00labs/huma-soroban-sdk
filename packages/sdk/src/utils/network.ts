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
        },
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
            'CBXUR3AZ55267TY5ZN3VDWMCLTYIXWRM3A6CY35WUI3IXERALALZFL5X',
          poolStorage:
            'CDJ6XX2WBWREDZDGAOGLULXHSS4KNIPQHVPATG6KVDZ5J5HTTTLLDC43',
          pool: 'CCEE4AEQXENDNCBBE6NJA43UOFXDHVCAIARAR2NAKPETKJ6HTS6QAOFW',
          poolManager:
            'CAPUJ7SFTTAM6I2O6MR2SKMFWWK7ZZCDIFWYPKQVDEPVGEHHSQXVMI77',
          poolCredit:
            'CCANGNNOXXTCDJ4DTN6RQZ6LL7BPDKOFJFD62G4AQ7OG362PCVG4OK3U',
          creditManager:
            'CDJ4B3MPTOIYQ3BUHAFSNNK3OIOMTB4H2L4LZLHTUWP2B6KX6KRZNCLW',
          creditStorage:
            'CCWDV53HATIFKR3WL2G64BA7AFA4HIAJWE3ADHJY54XQTM3EYCIN2SHS',
          juniorTranche:
            'CC356H4PYZWNZ4G5P2LZUSD65PZK5OHAFDRM37QE27TZ5BOYRYQB7S7M',
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

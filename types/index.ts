declare global {
  interface Window {
    EvmCodes: any
  }
}

export interface IOpcode {
  code: string
  name: string | undefined
  input: string
  output: string
  description: string
  staticFee?: number
  minimumFee: number
  dynamicFee?: {
    [fork: string]: {
      inputs: {
        [name: string]: {
          type: 'number' | 'boolean'
          label: string
        }
      }
    }
  }
}

export interface IOpcodeMeta {
  name?: string
  input: string
  output: string
  description: string
}

export interface IOpcodeMetaList {
  [code: string]: IOpcodeMeta
}

export interface IInstruction {
  id: number
  name: string
  value?: string | undefined
  hasBreakpoint?: boolean
}

export interface IStorage {
  address: string
  slot: string
  value: string
}

export interface IExecutionState {
  programCounter: number | undefined
  stack: string[]
  storage: IStorage[]
  memory: string | undefined
  totalGas: string | undefined
  currentGas: string | undefined
  returnValue: string | undefined
}

export interface IChain {
  id: number
  name: string
}

export interface IOpcodeDocMeta {
  fork: string
  group: string
}

export interface IOpcodeDoc {
  meta: IOpcodeDocMeta
  mdxSource: any
}

export interface IOpcodeDocs {
  [opcode: string]: IOpcodeDoc
}

export interface IOpcodeGasDoc {
  [fork: string]: string
}

export interface IOpcodeGasDocs {
  [opcode: string]: IOpcodeGasDoc
}

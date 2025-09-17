/**
 * PersonaRegistryコントラクトのABIと設定
 */

import { Address } from 'viem';

// コントラクトアドレス（Anvilローカルチェーン用）
export const PERSONA_REGISTRY_ADDRESS: Address = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

// PersonaRegistryコントラクトのABI
// Foundryで生成されたJSONから抽出した重要な関数のみを含める
export const PERSONA_REGISTRY_ABI = [
  // 人格作成
  {
    type: 'function',
    name: 'createPersona',
    inputs: [
      { name: '_name', type: 'string', internalType: 'string' },
      { name: '_age', type: 'uint8', internalType: 'uint8' },
      { name: '_occupation', type: 'string', internalType: 'string' },
      { name: '_background', type: 'string', internalType: 'string' },
      { name: '_traits', type: 'string', internalType: 'string' },
      { name: '_speakingStyle', type: 'string', internalType: 'string' },
      { name: '_tone', type: 'string', internalType: 'string' },
      { name: '_expertise', type: 'string', internalType: 'string' },
      { name: '_experiences', type: 'string', internalType: 'string' },
      { name: '_memories', type: 'string', internalType: 'string' },
      { name: '_beliefs', type: 'string', internalType: 'string' },
      { name: '_priorities', type: 'string', internalType: 'string' }
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable'
  },
  
  // 人格更新
  {
    type: 'function',
    name: 'updatePersona',
    inputs: [
      { name: '_personaId', type: 'uint256', internalType: 'uint256' },
      { name: '_name', type: 'string', internalType: 'string' },
      { name: '_age', type: 'uint8', internalType: 'uint8' },
      { name: '_occupation', type: 'string', internalType: 'string' },
      { name: '_background', type: 'string', internalType: 'string' },
      { name: '_traits', type: 'string', internalType: 'string' },
      { name: '_speakingStyle', type: 'string', internalType: 'string' },
      { name: '_tone', type: 'string', internalType: 'string' },
      { name: '_expertise', type: 'string', internalType: 'string' },
      { name: '_experiences', type: 'string', internalType: 'string' },
      { name: '_memories', type: 'string', internalType: 'string' },
      { name: '_beliefs', type: 'string', internalType: 'string' },
      { name: '_priorities', type: 'string', internalType: 'string' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },

  // 人格データ取得
  {
    type: 'function',
    name: 'getPersona',
    inputs: [{ name: '_personaId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct PersonaRegistry.Persona',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'name', type: 'string', internalType: 'string' },
          {
            name: 'basicInfo',
            type: 'tuple',
            internalType: 'struct PersonaRegistry.BasicInfo',
            components: [
              { name: 'age', type: 'uint8', internalType: 'uint8' },
              { name: 'occupation', type: 'string', internalType: 'string' },
              { name: 'background', type: 'string', internalType: 'string' }
            ]
          },
          {
            name: 'personality',
            type: 'tuple',
            internalType: 'struct PersonaRegistry.Personality',
            components: [
              { name: 'traits', type: 'string', internalType: 'string' },
              { name: 'speakingStyle', type: 'string', internalType: 'string' },
              { name: 'tone', type: 'string', internalType: 'string' }
            ]
          },
          {
            name: 'knowledge',
            type: 'tuple',
            internalType: 'struct PersonaRegistry.Knowledge',
            components: [
              { name: 'expertise', type: 'string', internalType: 'string' },
              { name: 'experiences', type: 'string', internalType: 'string' },
              { name: 'memories', type: 'string', internalType: 'string' }
            ]
          },
          {
            name: 'values',
            type: 'tuple',
            internalType: 'struct PersonaRegistry.Values',
            components: [
              { name: 'beliefs', type: 'string', internalType: 'string' },
              { name: 'priorities', type: 'string', internalType: 'string' }
            ]
          },
          { name: 'owner', type: 'address', internalType: 'address' },
          { name: 'createdAt', type: 'uint256', internalType: 'uint256' },
          { name: 'updatedAt', type: 'uint256', internalType: 'uint256' },
          { name: 'isActive', type: 'bool', internalType: 'bool' }
        ]
      }
    ],
    stateMutability: 'view'
  },

  // ユーザーの人格ID一覧取得
  {
    type: 'function',
    name: 'getUserPersonaIds',
    inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256[]', internalType: 'uint256[]' }],
    stateMutability: 'view'
  },

  // ユーザーの全人格データ取得（アクティブのみ）
  {
    type: 'function',
    name: 'getUserPersonasWithData',
    inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct PersonaRegistry.Persona[]',
        components: [
          { name: 'id', type: 'uint256', internalType: 'uint256' },
          { name: 'name', type: 'string', internalType: 'string' },
          {
            name: 'basicInfo',
            type: 'tuple',
            internalType: 'struct PersonaRegistry.BasicInfo',
            components: [
              { name: 'age', type: 'uint8', internalType: 'uint8' },
              { name: 'occupation', type: 'string', internalType: 'string' },
              { name: 'background', type: 'string', internalType: 'string' }
            ]
          },
          {
            name: 'personality',
            type: 'tuple',
            internalType: 'struct PersonaRegistry.Personality',
            components: [
              { name: 'traits', type: 'string', internalType: 'string' },
              { name: 'speakingStyle', type: 'string', internalType: 'string' },
              { name: 'tone', type: 'string', internalType: 'string' }
            ]
          },
          {
            name: 'knowledge',
            type: 'tuple',
            internalType: 'struct PersonaRegistry.Knowledge',
            components: [
              { name: 'expertise', type: 'string', internalType: 'string' },
              { name: 'experiences', type: 'string', internalType: 'string' },
              { name: 'memories', type: 'string', internalType: 'string' }
            ]
          },
          {
            name: 'values',
            type: 'tuple',
            internalType: 'struct PersonaRegistry.Values',
            components: [
              { name: 'beliefs', type: 'string', internalType: 'string' },
              { name: 'priorities', type: 'string', internalType: 'string' }
            ]
          },
          { name: 'owner', type: 'address', internalType: 'address' },
          { name: 'createdAt', type: 'uint256', internalType: 'uint256' },
          { name: 'updatedAt', type: 'uint256', internalType: 'uint256' },
          { name: 'isActive', type: 'bool', internalType: 'bool' }
        ]
      }
    ],
    stateMutability: 'view'
  },

  // 人格の所有権移転
  {
    type: 'function',
    name: 'transferPersona',
    inputs: [
      { name: '_personaId', type: 'uint256', internalType: 'uint256' },
      { name: '_to', type: 'address', internalType: 'address' }
    ],
    outputs: [],
    stateMutability: 'nonpayable'
  },

  // 人格の無効化
  {
    type: 'function',
    name: 'deactivatePersona',
    inputs: [{ name: '_personaId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },

  // 人格の再有効化
  {
    type: 'function',
    name: 'reactivatePersona',
    inputs: [{ name: '_personaId', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable'
  },

  // 総人格数取得
  {
    type: 'function',
    name: 'getTotalPersonaCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },

  // 特定ユーザーのアクティブ人格数取得
  {
    type: 'function',
    name: 'getUserActivePersonaCount',
    inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view'
  },

  // Events
  {
    type: 'event',
    name: 'PersonaCreated',
    inputs: [
      { name: 'personaId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'owner', type: 'address', indexed: true, internalType: 'address' },
      { name: 'name', type: 'string', indexed: false, internalType: 'string' }
    ],
    anonymous: false
  },

  {
    type: 'event',
    name: 'PersonaUpdated',
    inputs: [
      { name: 'personaId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'name', type: 'string', indexed: false, internalType: 'string' }
    ],
    anonymous: false
  },

  {
    type: 'event',
    name: 'PersonaTransferred',
    inputs: [
      { name: 'personaId', type: 'uint256', indexed: true, internalType: 'uint256' },
      { name: 'from', type: 'address', indexed: false, internalType: 'address' },
      { name: 'to', type: 'address', indexed: false, internalType: 'address' }
    ],
    anonymous: false
  },

  {
    type: 'event',
    name: 'PersonaDeactivated',
    inputs: [
      { name: 'personaId', type: 'uint256', indexed: true, internalType: 'uint256' }
    ],
    anonymous: false
  }
] as const;

// コントラクト設定オブジェクト
export const PERSONA_REGISTRY_CONTRACT = {
  address: PERSONA_REGISTRY_ADDRESS,
  abi: PERSONA_REGISTRY_ABI,
} as const;

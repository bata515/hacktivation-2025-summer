'use client';

/**
 * PersonaRegistryコントラクトとの相互作用を管理するカスタムフック
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import { useAccount } from 'wagmi';
import { useCallback, useState } from 'react';
import { Address } from 'viem';
import { PERSONA_REGISTRY_CONTRACT } from '@/lib/contracts';
import { 
  Persona, 
  PersonaFormData, 
  CreatePersonaArgs, 
  TransactionStatus,
  ContractError 
} from '@/types/persona';
import { formDataToContractArgs, translateContractError } from '@/lib/utils';

/**
 * 人格作成用のカスタムフック
 */
export function useCreatePersona() {
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1, // Anvilでは1確認で十分
  });

  const createPersona = useCallback(async (formData: PersonaFormData) => {
    try {
      setStatus('pending');
      setError(null);
      
      const args = formDataToContractArgs(formData);
      
      await writeContract({
        ...PERSONA_REGISTRY_CONTRACT,
        functionName: 'createPersona',
        args,
      });
      
      setStatus('success');
    } catch (err: any) {
      const errorMessage = translateContractError(err);
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  }, [writeContract]);

  return {
    createPersona,
    hash,
    isPending: isPending || isConfirming,
    status,
    error,
  };
}

/**
 * 人格更新用のカスタムフック
 */
export function useUpdatePersona() {
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1,
  });

  const updatePersona = useCallback(async (personaId: bigint, formData: PersonaFormData) => {
    try {
      setStatus('pending');
      setError(null);
      
      const args = formDataToContractArgs(formData);
      
      await writeContract({
        ...PERSONA_REGISTRY_CONTRACT,
        functionName: 'updatePersona',
        args: [personaId, ...args],
      });
      
      setStatus('success');
    } catch (err: any) {
      const errorMessage = translateContractError(err);
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  }, [writeContract]);

  return {
    updatePersona,
    hash,
    isPending: isPending || isConfirming,
    status,
    error,
  };
}

/**
 * 単一人格データ取得用のカスタムフック
 */
export function usePersona(personaId: bigint | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    ...PERSONA_REGISTRY_CONTRACT,
    functionName: 'getPersona',
    args: personaId ? [personaId] : undefined,
    query: {
      enabled: !!personaId && personaId > 0n,
      retry: false,
    },
  });

  return {
    persona: data as Persona | undefined,
    isLoading,
    error: error ? translateContractError(error) : null,
    refetch,
  };
}

/**
 * ユーザーの人格一覧取得用のカスタムフック
 */
export function useUserPersonas(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const { data, isLoading, error, refetch } = useReadContract({
    ...PERSONA_REGISTRY_CONTRACT,
    functionName: 'getUserPersonasWithData',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      retry: false,
      // データが更新される可能性があるため、staleTimeを短く設定
      staleTime: 1000 * 30, // 30秒
    },
  });

  return {
    personas: data as Persona[] | undefined,
    isLoading,
    error: error ? translateContractError(error) : null,
    refetch,
  };
}

/**
 * ユーザーの人格ID一覧取得用のカスタムフック
 */
export function useUserPersonaIds(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const { data, isLoading, error } = useReadContract({
    ...PERSONA_REGISTRY_CONTRACT,
    functionName: 'getUserPersonaIds',
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
      retry: false,
    },
  });

  return {
    personaIds: data as bigint[] | undefined,
    isLoading,
    error: error ? translateContractError(error) : null,
  };
}

/**
 * 人格の所有権移転用のカスタムフック
 */
export function useTransferPersona() {
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1,
  });

  const transferPersona = useCallback(async (personaId: bigint, toAddress: Address) => {
    try {
      setStatus('pending');
      setError(null);
      
      await writeContract({
        ...PERSONA_REGISTRY_CONTRACT,
        functionName: 'transferPersona',
        args: [personaId, toAddress],
      });
      
      setStatus('success');
    } catch (err: any) {
      const errorMessage = translateContractError(err);
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  }, [writeContract]);

  return {
    transferPersona,
    hash,
    isPending: isPending || isConfirming,
    status,
    error,
  };
}

/**
 * 人格の無効化用のカスタムフック
 */
export function useDeactivatePersona() {
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1,
  });

  const deactivatePersona = useCallback(async (personaId: bigint) => {
    try {
      setStatus('pending');
      setError(null);
      
      await writeContract({
        ...PERSONA_REGISTRY_CONTRACT,
        functionName: 'deactivatePersona',
        args: [personaId],
      });
      
      setStatus('success');
    } catch (err: any) {
      const errorMessage = translateContractError(err);
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  }, [writeContract]);

  return {
    deactivatePersona,
    hash,
    isPending: isPending || isConfirming,
    status,
    error,
  };
}

/**
 * 人格の再有効化用のカスタムフック
 */
export function useReactivatePersona() {
  const [status, setStatus] = useState<TransactionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1,
  });

  const reactivatePersona = useCallback(async (personaId: bigint) => {
    try {
      setStatus('pending');
      setError(null);
      
      await writeContract({
        ...PERSONA_REGISTRY_CONTRACT,
        functionName: 'reactivatePersona',
        args: [personaId],
      });
      
      setStatus('success');
    } catch (err: any) {
      const errorMessage = translateContractError(err);
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  }, [writeContract]);

  return {
    reactivatePersona,
    hash,
    isPending: isPending || isConfirming,
    status,
    error,
  };
}

/**
 * 総人格数取得用のカスタムフック
 */
export function useTotalPersonaCount() {
  const { data, isLoading, error } = useReadContract({
    ...PERSONA_REGISTRY_CONTRACT,
    functionName: 'getTotalPersonaCount',
    query: {
      staleTime: 1000 * 60, // 1分
    },
  });

  return {
    totalCount: data ? Number(data) : undefined,
    isLoading,
    error: error ? translateContractError(error) : null,
  };
}

/**
 * コントラクトイベントを監視するカスタムフック
 */
export function usePersonaEvents(onPersonaCreated?: (args: any) => void) {
  useWatchContractEvent({
    ...PERSONA_REGISTRY_CONTRACT,
    eventName: 'PersonaCreated',
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (onPersonaCreated) {
          onPersonaCreated(log.args);
        }
      });
    },
  });

  useWatchContractEvent({
    ...PERSONA_REGISTRY_CONTRACT,
    eventName: 'PersonaUpdated',
    onLogs: (logs) => {
      console.log('Persona updated:', logs);
    },
  });

  useWatchContractEvent({
    ...PERSONA_REGISTRY_CONTRACT,
    eventName: 'PersonaTransferred',
    onLogs: (logs) => {
      console.log('Persona transferred:', logs);
    },
  });

  useWatchContractEvent({
    ...PERSONA_REGISTRY_CONTRACT,
    eventName: 'PersonaDeactivated',
    onLogs: (logs) => {
      console.log('Persona deactivated:', logs);
    },
  });
}

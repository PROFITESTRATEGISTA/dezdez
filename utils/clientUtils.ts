import { ClientData } from '../data/clientsDatabase';

/**
 * Determines the overall status of a client based on their payment, documents, and contract status
 */
export const getClientOverallStatus = (client: ClientData): 'active' | 'pending' | 'overdue' | 'undefined' => {
  if (!client || !client.status) {
    return 'undefined';
  }

  // Check if payment is overdue
  if (client.status.payment === 'overdue') {
    return 'overdue';
  }

  // Check if documents are pending or rejected
  if (client.status.documents === 'pending' || client.status.documents === 'rejected') {
    return 'pending';
  }

  // Check if contract is pending
  if (client.status.contract === 'pending') {
    return 'pending';
  }

  // Check if payment is pending
  if (client.status.payment === 'pending') {
    return 'pending';
  }

  // If everything is approved/signed/paid, client is active
  if (
    client.status.payment === 'paid' &&
    client.status.documents === 'approved' &&
    client.status.contract === 'signed'
  ) {
    return 'active';
  }

  // Default to pending if status is unclear
  return 'pending';
};

/**
 * Checks if a client has pending documents
 */
export const hasClientPendingDocuments = (client: ClientData): boolean => {
  return client?.status?.documents === 'pending';
};

/**
 * Checks if a client has pending contract signature
 */
export const hasClientPendingSignature = (client: ClientData): boolean => {
  return client?.status?.documents === 'approved' && client?.status?.contract === 'pending';
};

/**
 * Checks if a client has billing issues (pending or overdue)
 */
export const hasClientBillingIssues = (client: ClientData): boolean => {
  return client?.status?.payment === 'pending' || client?.status?.payment === 'overdue';
};

/**
 * Gets a human-readable status description
 */
export const getClientStatusDescription = (client: ClientData): string => {
  const status = getClientOverallStatus(client);
  
  switch (status) {
    case 'active':
      return 'Cliente ativo com todos os documentos aprovados';
    case 'pending':
      if (client.status.documents === 'pending') {
        return 'Documentos aguardando análise';
      }
      if (client.status.contract === 'pending') {
        return 'Contrato aguardando assinatura';
      }
      if (client.status.payment === 'pending') {
        return 'Pagamento pendente';
      }
      return 'Status pendente';
    case 'overdue':
      return 'Pagamento em atraso';
    default:
      return 'Status indefinido';
  }
};
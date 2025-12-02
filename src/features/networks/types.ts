export interface Network {
  Id: string;
  Name: string;
  Driver: string;
  Scope: string;
  Created: string; // ISO 8601 format date string
  IPAM?: {
    Config?: Array<{
      Subnet?: string;
      Gateway?: string;
    }>;
  };
  Internal: boolean;
  // Containers?: Record<string, any>; // Se quisermos contar quantos containers usam
}

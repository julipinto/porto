export interface ContainerSummary {
  Id: string;
  Names: string[];
  Image: string;
  State: string; // "running", "exited", etc.
  Status: string; // "Up 2 hours"
  Labels: Record<string, string>;
  Ports?: Array<{
    IP?: string;
    PrivatePort: number;
    PublicPort?: number;
    Type: string;
  }>;
}

export interface ContainerInspectInfo {
  Id: string;
  Created: string;
  Platform: string;
  State: {
    Status: string;
    Running: boolean;
    // ... outros campos se precisar
  };
  Name: string;
  Config: {
    Image: string;
    Cmd: string[];
    Env: string[];
  };
  NetworkSettings: {
    Networks: Record<
      string,
      {
        IPAddress: string;
        Gateway: string;
      }
    >;
    Ports: Record<
      string,
      Array<{
        HostIp: string;
        HostPort: string;
      }> | null
    >;
  };
  // Permitimos outros campos desconhecidos para não quebrar se acessarmos algo extra
  [key: string]: unknown;
}

export interface PortInfo {
  IP?: string;
  PrivatePort: number;
  PublicPort?: number;
  Type: string;
}

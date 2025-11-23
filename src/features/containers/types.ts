export interface ContainerSummary {
  Id: string;
  Names: string[];
  Image: string;
  State: string; // "running", "exited", etc.
  Status: string; // "Up 2 hours"
  Labels: Record<string, string>;
}
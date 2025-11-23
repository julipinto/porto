import { ContainerSummary } from "../types";

export interface GroupedContainers {
  groups: Record<string, ContainerSummary[]>;
  sortedGroupNames: string[];
  standalone: ContainerSummary[];
}

export function groupContainersByStack(list: ContainerSummary[]): GroupedContainers {
  const groups: Record<string, ContainerSummary[]> = {};
  const standalone: ContainerSummary[] = [];

  list.forEach((container) => {
    // Optional chaining seguro para acessar a label
    const projectName = container.Labels?.['com.docker.compose.project'];

    if (projectName) {
      if (!groups[projectName]) groups[projectName] = [];
      groups[projectName].push(container);
    } else {
      standalone.push(container);
    }
  });

  return {
    groups,
    sortedGroupNames: Object.keys(groups).sort(),
    standalone,
  };
}
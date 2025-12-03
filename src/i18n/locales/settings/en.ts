export default {
  title: "Settings",
  description: "Manage preferences, language and application behavior.",
  tabs: {
    general: "General",
    advanced: "Advanced",
  },
  general: {
    language: {
      title: "Language & Region",
      interfaceLanguage: "Interface Language",
    },
    interface: {
      title: "Interface & Appearance",
      systemMonitor: "System Monitoring",
      systemMonitorDescription: "Display CPU and RAM bar in the application footer.",
    },
  },
  advanced: {
    detectedContexts: {
      title: "Detected Contexts",
      connected: "CONNECTED",
      cliDefault: "CLI Default",
      cliDefaultTooltip: "This is your terminal's default context",
    },
    manualConnection: {
      title: "Manual Connection",
      description:
        "Select the socket file (Unix) or enter the TCP address to connect to a remote host.",
      placeholder: "unix:///var/run/docker.sock",
      browseSocket: "Browse .sock file",
      connect: "Connect",
    },
    maintenance: {
      title: "System Maintenance",
      prune: "Cleanup (Prune)",
      pruneDescription:
        "Removes stopped containers, unused networks and untagged images to free up disk space.",
      cleanSystem: "Clean System",
    },
  },
  pruneModal: {
    title: "System Cleanup",
    cancel: "Cancel",
    confirmClean: "Confirm Cleanup",
    cleaning: "Cleaning...",
    close: "Close",
    warning: {
      title: "Warning: Destructive Operation",
      description: "This will permanently remove:",
      items: {
        stoppedContainers: "All stopped containers",
        unusedNetworks: "All unused networks",
        danglingImages: 'All "dangling" images (untagged)',
      },
    },
    success: {
      title: "System Cleaned!",
      spaceRecovered: "Space recovered:",
      containers: "Containers",
      images: "Images",
      networks: "Networks",
    },
  },
};

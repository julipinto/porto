export default {
  title: "Paramètres",
  description: "Gérez les préférences, la langue et le comportement de l'application.",
  tabs: {
    general: "Général",
    advanced: "Avancé",
  },
  general: {
    language: {
      title: "Langue et Région",
      interfaceLanguage: "Langue de l'Interface",
    },
    interface: {
      title: "Interface et Apparence",
      systemMonitor: "Surveillance du Système",
      systemMonitorDescription:
        "Afficher la barre CPU et RAM dans le pied de page de l'application.",
    },
  },
  advanced: {
    detectedContexts: {
      title: "Contextes Détectés",
      connected: "CONNECTÉ",
      cliDefault: "CLI par Défaut",
      cliDefaultTooltip: "Ceci est le contexte par défaut de votre terminal",
    },
    manualConnection: {
      title: "Connexion Manuelle",
      description:
        "Sélectionnez le fichier socket (Unix) ou entrez l'adresse TCP pour vous connecter à un hôte distant.",
      placeholder: "unix:///var/run/docker.sock",
      browseSocket: "Parcourir le fichier .sock",
      connect: "Se Connecter",
    },
    maintenance: {
      title: "Maintenance du Système",
      prune: "Nettoyage (Prune)",
      pruneDescription:
        "Supprime les conteneurs arrêtés, les réseaux inutilisés et les images sans étiquette pour libérer de l'espace disque.",
      cleanSystem: "Nettoyer le Système",
    },
  },
  pruneModal: {
    title: "Nettoyage du Système",
    cancel: "Annuler",
    confirmClean: "Confirmer le Nettoyage",
    cleaning: "Nettoyage...",
    close: "Fermer",
    warning: {
      title: "Avertissement: Opération Destructive",
      description: "Cela supprimera définitivement:",
      items: {
        stoppedContainers: "Tous les conteneurs arrêtés",
        unusedNetworks: "Tous les réseaux inutilisés",
        danglingImages: 'Toutes les images "dangling" (sans étiquette)',
      },
    },
    success: {
      title: "Système Nettoyé!",
      spaceRecovered: "Espace récupéré:",
      containers: "Conteneurs",
      images: "Images",
      networks: "Réseaux",
    },
  },
};

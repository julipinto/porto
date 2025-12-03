export default {
  list: {
    title: "Images Locales",
    subtitle: "{count} images stockées",
    searchPlaceholder: "Rechercher une image par étiquette ou ID...",
    pullImage: "Télécharger l'Image",
    tableHeaders: {
      tagRepo: "Étiquette / Dépôt",
      id: "ID",
      size: "Taille",
      createdAt: "Créé",
      actions: "Actions",
    },
    empty: {
      loading: "Recherche...",
      noImages: "Aucune image trouvée.",
    },
  },
  details: {
    back: "Retour",
    image: "IMAGE",
    run: "Exécuter",
    delete: "Supprimer",
  },
  pullModal: {
    title: "Télécharger une Nouvelle Image",
    cancel: "Annuler",
    pull: "Télécharger",
    pulling: "Téléchargement...",
    repositoryTag: "Dépôt / Étiquette",
    repositoryTagPlaceholder: "ex: mongo:latest",
    tagNote: "Si aucune étiquette n'est spécifiée, :latest sera utilisé.",
    error: "Erreur: {error}",
    success: "Image téléchargée avec succès !",
    starting: "Démarrage de la connexion...",
    completed: "Terminé",
    downloadFinished: "Téléchargement terminé !",
  },
  actions: {
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer l\'image "{name}"?',
    removed: "Image supprimée.",
  },
};

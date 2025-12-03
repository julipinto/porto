export default {
  list: {
    title: "Volumes",
    subtitle: "{count} persistent volumes",
    searchPlaceholder: "Search volume...",
    tableHeaders: {
      nameDriver: "Name / Driver",
      mountPoint: "Mount Point",
      createdAt: "Created",
      actions: "Actions",
    },
    empty: {
      loading: "Searching...",
      noVolumes: "No volumes found.",
    },
  },
  details: {
    back: "Back",
    volume: "VOLUME",
    deleteVolume: "Delete Volume",
    loading: "Loading details...",
    confirmDelete: 'Are you sure you want to remove volume "{name}"?',
    removed: "Volume removed.",
  },
};

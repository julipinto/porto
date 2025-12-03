export default {
  list: {
    title: "Local Images",
    subtitle: "{count} images stored",
    searchPlaceholder: "Search image by tag or ID...",
    pullImage: "Pull Image",
    tableHeaders: {
      tagRepo: "Tag / Repository",
      id: "ID",
      size: "Size",
      createdAt: "Created",
      actions: "Actions",
    },
    empty: {
      loading: "Searching...",
      noImages: "No images found.",
    },
  },
  details: {
    back: "Back",
    image: "IMAGE",
    run: "Run",
    delete: "Delete",
  },
  pullModal: {
    title: "Pull New Image",
    cancel: "Cancel",
    pull: "Pull",
    pulling: "Pulling...",
    repositoryTag: "Repository / Tag",
    repositoryTagPlaceholder: "e.g. mongo:latest",
    tagNote: "If no tag is specified, :latest will be used.",
    error: "Error: {error}",
    success: "Image pulled successfully!",
    starting: "Starting connection...",
    completed: "Completed",
    downloadFinished: "Download finished!",
  },
  actions: {
    confirmDelete: 'Are you sure you want to remove image "{name}"?',
    removed: "Image removed.",
  },
};

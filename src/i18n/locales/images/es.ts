export default {
  list: {
    title: "Imágenes Locales",
    subtitle: "{count} imágenes almacenadas",
    searchPlaceholder: "Buscar imagen por etiqueta o ID...",
    pullImage: "Descargar Imagen",
    tableHeaders: {
      tagRepo: "Etiqueta / Repositorio",
      id: "ID",
      size: "Tamaño",
      createdAt: "Creado",
      actions: "Acciones",
    },
    empty: {
      loading: "Buscando...",
      noImages: "No se encontraron imágenes.",
    },
  },
  details: {
    back: "Volver",
    image: "IMAGEN",
    run: "Ejecutar",
    delete: "Eliminar",
  },
  pullModal: {
    title: "Descargar Nueva Imagen",
    cancel: "Cancelar",
    pull: "Descargar",
    pulling: "Descargando...",
    repositoryTag: "Repositorio / Etiqueta",
    repositoryTagPlaceholder: "ej: mongo:latest",
    tagNote: "Si no se especifica la etiqueta, se usará :latest.",
    error: "Error: {error}",
    success: "¡Imagen descargada con éxito!",
    starting: "Iniciando conexión...",
    completed: "Completado",
    downloadFinished: "¡Descarga finalizada!",
  },
  actions: {
    confirmDelete: '¿Está seguro de que desea eliminar la imagen "{name}"?',
    removed: "Imagen eliminada.",
  },
};

export default {
  list: {
    title: "Imagens Locais",
    subtitle: "{count} imagens armazenadas",
    searchPlaceholder: "Buscar imagem por tag ou ID...",
    pullImage: "Pull Image",
    tableHeaders: {
      tagRepo: "Tag / Repositório",
      id: "ID",
      size: "Tamanho",
      createdAt: "Criado em",
      actions: "Ações",
    },
    empty: {
      loading: "Buscando...",
      noImages: "Nenhuma imagem encontrada.",
    },
  },
  details: {
    back: "Voltar",
    image: "IMAGE",
    run: "Run",
    delete: "Deletar",
  },
  pullModal: {
    title: "Baixar Nova Imagem",
    cancel: "Cancelar",
    pull: "Pull",
    pulling: "Baixando...",
    repositoryTag: "Repositório / Tag",
    repositoryTagPlaceholder: "ex: mongo:latest",
    tagNote: "Se não informar a tag, será usado :latest.",
    error: "Erro: {error}",
    success: "Imagem baixada com sucesso!",
    starting: "Iniciando conexão...",
    completed: "Concluído",
    downloadFinished: "Download finalizado!",
  },
  actions: {
    confirmDelete: 'Tem certeza que deseja remover a imagem "{name}"?',
    removed: "Imagem removida.",
  },
};

export default {
  title: "Configurações",
  description: "Gerencie as preferências, idioma e comportamento da aplicação.",
  tabs: {
    general: "Geral",
    advanced: "Avançado",
  },
  general: {
    language: {
      title: "Idioma e Região",
      interfaceLanguage: "Idioma da Interface",
    },
    interface: {
      title: "Interface & Aparência",
      systemMonitor: "Monitoramento de Sistema",
      systemMonitorDescription: "Exibir barra de CPU e RAM no rodapé da aplicação.",
    },
  },
  advanced: {
    detectedContexts: {
      title: "Contextos Detectados",
      connected: "CONECTADO",
      cliDefault: "CLI Default",
      cliDefaultTooltip: "Este é o contexto padrão do seu terminal",
    },
    manualConnection: {
      title: "Conexão Manual",
      description:
        "Selecione o arquivo de socket (Unix) ou digite o endereço TCP para conectar a um host remoto.",
      placeholder: "unix:///var/run/docker.sock",
      browseSocket: "Procurar arquivo .sock",
      connect: "Conectar",
    },
    maintenance: {
      title: "Manutenção do Sistema",
      prune: "Limpeza de Lixo (Prune)",
      pruneDescription:
        "Remove containers parados, redes não usadas e imagens sem tag para liberar espaço em disco.",
      cleanSystem: "Limpar Sistema",
    },
  },
  pruneModal: {
    title: "Limpeza do Sistema",
    cancel: "Cancelar",
    confirmClean: "Confirmar Limpeza",
    cleaning: "Limpando...",
    close: "Fechar",
    warning: {
      title: "Atenção: Operação Destrutiva",
      description: "Isso irá remover permanentemente:",
      items: {
        stoppedContainers: "Todos os containers parados",
        unusedNetworks: "Todas as redes não utilizadas",
        danglingImages: 'Todas as imagens "dangling" (sem tag)',
      },
    },
    success: {
      title: "Sistema Limpo!",
      spaceRecovered: "Espaço recuperado:",
      containers: "Containers",
      images: "Imagens",
      networks: "Redes",
    },
  },
};

export default {
  title: "Configuración",
  description: "Gestione las preferencias, idioma y comportamiento de la aplicación.",
  tabs: {
    general: "General",
    advanced: "Avanzado",
  },
  general: {
    language: {
      title: "Idioma y Región",
      interfaceLanguage: "Idioma de la Interfaz",
    },
    interface: {
      title: "Interfaz y Apariencia",
      systemMonitor: "Monitoreo del Sistema",
      systemMonitorDescription: "Mostrar barra de CPU y RAM en el pie de página de la aplicación.",
    },
  },
  advanced: {
    detectedContexts: {
      title: "Contextos Detectados",
      connected: "CONECTADO",
      cliDefault: "CLI Predeterminado",
      cliDefaultTooltip: "Este es el contexto predeterminado de su terminal",
    },
    manualConnection: {
      title: "Conexión Manual",
      description:
        "Seleccione el archivo de socket (Unix) o ingrese la dirección TCP para conectarse a un host remoto.",
      placeholder: "unix:///var/run/docker.sock",
      browseSocket: "Buscar archivo .sock",
      connect: "Conectar",
    },
    maintenance: {
      title: "Mantenimiento del Sistema",
      prune: "Limpieza (Prune)",
      pruneDescription:
        "Elimina contenedores detenidos, redes no utilizadas e imágenes sin etiqueta para liberar espacio en disco.",
      cleanSystem: "Limpiar Sistema",
    },
  },
  pruneModal: {
    title: "Limpieza del Sistema",
    cancel: "Cancelar",
    confirmClean: "Confirmar Limpieza",
    cleaning: "Limpiando...",
    close: "Cerrar",
    warning: {
      title: "Advertencia: Operación Destructiva",
      description: "Esto eliminará permanentemente:",
      items: {
        stoppedContainers: "Todos los contenedores detenidos",
        unusedNetworks: "Todas las redes no utilizadas",
        danglingImages: 'Todas las imágenes "dangling" (sin etiqueta)',
      },
    },
    success: {
      title: "¡Sistema Limpio!",
      spaceRecovered: "Espacio recuperado:",
      containers: "Contenedores",
      images: "Imágenes",
      networks: "Redes",
    },
  },
};

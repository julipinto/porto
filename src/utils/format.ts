export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function formatTimeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp * 1000) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} anos atrás`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} meses atrás`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} dias atrás`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} horas atrás`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} min atrás`;
  return `${Math.floor(seconds)} seg atrás`;
}

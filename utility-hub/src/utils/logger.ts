let logs: string[] = [];

export function addLog(msg: string) {
  logs.push(`[${new Date().toISOString()}] ${msg}`);
  if (logs.length > 50) logs = logs.slice(-50);
}

export function getLogs() {
  return logs;
}

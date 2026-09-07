export const NOTIFICATION_TIMEOUT_MS = 10000;

export function withNotificationTimeout<T>(task: Promise<T>, timeoutMs = NOTIFICATION_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Notification operation timed out')), timeoutMs);
  });
  return Promise.race([task, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Placeholder for a future WebSocket / SSE collaboration layer.
 * No connections are opened — avoids accidental global listeners affecting HTTP isolation.
 *
 * FUTURE: Socket.IO or ws server on separate port; authenticate via JWT query/header;
 * broadcast project-scoped events only after checkProjectAccess.
 */
export function attachRealtimeGateway(_httpServer) {
  return null;
}

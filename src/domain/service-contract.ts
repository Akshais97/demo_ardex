// Domain contracts stay independent of React and browser persistence.
export type Actor = 'applicator' | 'homeowner' | 'admin';
export type DeliveryMode = 'browser-only' | 'shared-service';
export interface Command { id: string; sessionId: string; actor: Actor; expectedRevision: number; type: string; payload: unknown }
export interface Snapshot { sessionId: string; revision: number; state: unknown }
export interface DomainEvent { id: string; sessionId: string; revision: number; type: string; payload: unknown }
export interface DemoService {
  mode: DeliveryMode;
  getSnapshot(sessionId: string): Promise<Snapshot>;
  dispatch(command: Command): Promise<Snapshot>;
  subscribe(sessionId: string, receive: (event: DomainEvent) => void): () => void;
}
// A future server must atomically reject stale revisions and deduplicate command IDs.
// This drop defines the boundary; no business command or shared server exists yet.

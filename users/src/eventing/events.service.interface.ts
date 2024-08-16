export const EVENTS_SERVICE = Symbol('EventsService');

export interface IEventsService {
  send(exchange: string, routingKey: string, data: any): Promise<void>;
}

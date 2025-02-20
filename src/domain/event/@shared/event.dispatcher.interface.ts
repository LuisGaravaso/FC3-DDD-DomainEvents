import EventHandlerInterface from "./event.handler.interface";
import EventInterface from "./event.interface";

export default interface EventDispatcherInterface {
    register(eventName: string, eventHandler: EventHandlerInterface): void;
    unregister(eventName: string, eventHandler: EventHandlerInterface): void;
    clear(): void;
    notify(event: EventInterface): void;
}
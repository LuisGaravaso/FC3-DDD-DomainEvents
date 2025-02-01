import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "../@shared/event.dispatcher";

describe("Domain Events test", () => {

    it("should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register("ProductCreated", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreated"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreated"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreated"][0]).toBe(eventHandler);

    }); 

    it("should unregister an event handler", () => {
        
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreated", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreated"][0]).toBe(eventHandler);

        eventDispatcher.unregister("ProductCreated", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreated"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreated"].length).toBe(0);
    });

    it("should clear all event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreated", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreated"][0]).toBe(eventHandler);

        eventDispatcher.clear();

        expect(eventDispatcher.getEventHandlers["ProductCreated"]).toBeUndefined();

    });

    it("should notify all event handlers", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toBe(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({ name: "Product 1", description: "Product 1 Description", price: 100 });

        // Quando o Notify for executado,
        // o SendEmailWhenProductIsCreatedHandler.handle deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);

    });
}); 

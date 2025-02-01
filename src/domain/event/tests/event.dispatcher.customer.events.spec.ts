import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerAddressChangedEvent from "../customer/customer-address-changed.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import FirstMessageWhenCustomerIsCreatedHandler from "../customer/handler/first-message-when-customer-is-created.handler";
import SecondMessageWhenCustomerIsCreatedHandler from "../customer/handler/second-message-when-customer-is-created.handler";
import SendMessageWhenCustomerAddressIsChangedHandler from "../customer/handler/send-message-when-customer-address-is-changed.handler";
import EventDispatcher from "../@shared/event.dispatcher";


describe("Domain Events test", () => {

    it("should register the events handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new FirstMessageWhenCustomerIsCreatedHandler();
        const eventHandler2 = new SecondMessageWhenCustomerIsCreatedHandler();
        const eventHandler3 = new SendMessageWhenCustomerAddressIsChangedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toContain(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toContain(eventHandler2);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toContain(eventHandler3);

    });

    it("should clear the events handler", () => {
        
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new FirstMessageWhenCustomerIsCreatedHandler();
        const eventHandler2 = new SecondMessageWhenCustomerIsCreatedHandler();
        const eventHandler3 = new SendMessageWhenCustomerAddressIsChangedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);

        eventDispatcher.clear();

        expect(eventDispatcher.getEventHandlers).toEqual({});

    });

    it("should unregister the events handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new FirstMessageWhenCustomerIsCreatedHandler();
        const eventHandler2 = new SecondMessageWhenCustomerIsCreatedHandler();
        const eventHandler3 = new SendMessageWhenCustomerAddressIsChangedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2);
        eventDispatcher.unregister("CustomerAddressChangedEvent", eventHandler3);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toEqual([]);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toEqual([]);
    });

    it("should only notify the creation events handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new FirstMessageWhenCustomerIsCreatedHandler();
        const eventHandler2 = new SecondMessageWhenCustomerIsCreatedHandler();
        const eventHandler3 = new SendMessageWhenCustomerAddressIsChangedHandler();

        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
        const spyEventHandler3 = jest.spyOn(eventHandler3, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);

        const customer = new Customer("1", "John Doe");
        const customerCreatedEvent = new CustomerCreatedEvent({ customer });
        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
        expect(spyEventHandler3).not.toHaveBeenCalled();

    });

    it("should create a new customer and change the address, notifying the events handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new FirstMessageWhenCustomerIsCreatedHandler();
        const eventHandler2 = new SecondMessageWhenCustomerIsCreatedHandler();
        const eventHandler3 = new SendMessageWhenCustomerAddressIsChangedHandler();

        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
        const spyEventHandler3 = jest.spyOn(eventHandler3, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler3);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);

        const customer = new Customer("1", "John Doe");
        const customerCreatedEvent = new CustomerCreatedEvent({ customer });
        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
        expect(spyEventHandler3).not.toHaveBeenCalled();

        const address = new Address("Main Street", 100, "12345", "Springfield");
        customer.changeAddress(address);
        
        const payload = { customerId: customer.id, customerName: customer.name, address: customer.address.toString()};
        const customerAddressChangedEvent = new CustomerAddressChangedEvent(payload);
        eventDispatcher.notify(customerAddressChangedEvent);

        // Make sure the first to events were only called once, during customer creation
        expect(spyEventHandler1).toHaveBeenCalledTimes(1);
        expect(spyEventHandler2).toHaveBeenCalledTimes(1);

        // The third event handler should be called now
        expect(spyEventHandler3).toHaveBeenCalled();

    });
});
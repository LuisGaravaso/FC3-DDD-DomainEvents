import EventHandlerInterface from "../../@shared/event.handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";


export default class SendMessageWhenCustomerAddressIsChangedHandler implements EventHandlerInterface<CustomerAddressChangedEvent> {
    handle(event: CustomerAddressChangedEvent): void {
        const payload = event.eventData
        const customerId = payload.customerId
        const customerName = payload.customerName
        const address = payload.address

        console.log(`Endereço do cliente: ${customerId}, ${customerName} alterado para: ${address}`);
    }
}
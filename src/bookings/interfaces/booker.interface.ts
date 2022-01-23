export interface IBooker {
  firstName: string;

  lastName: string;

  address: IBookerAddress;

  email: string;

  phone: string;
}

export class IBookerAddress {
  addressLine1: string;

  postalCode: string;

  countryCode: string;

  city: string;
}

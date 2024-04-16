export class Registration {
  constructor(
    public login: string,
    public email: string | null,
    public password: string,
    public langKey: string,
    public shopRole: boolean
  ) {}
}

// export class ShopRegistration {
//   constructor(public login: string, public email: string, public password: string, public langKey: string, public activated: boolean, public activationKey: string | null)
// }

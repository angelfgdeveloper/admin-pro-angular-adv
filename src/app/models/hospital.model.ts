interface _HospitalUser {
  id: string;
  nombre: string;
  img: string;
}

export class Hospital {

  constructor(
    public nombre: string,
    public img: string = '',
    public id?: string,
    public usuario?: _HospitalUser,
  ) {}

}

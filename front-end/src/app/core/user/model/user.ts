import { ApiResourceInterface } from "src/app/models/api-resource.interface";

export class User implements ApiResourceInterface {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNumber: string;
    department: string;
    position: string;
    image: string;
    roleId: string;

    constructor(firstName: string, lastName: string, email: string, phoneNumber: string, department: string, position: string, image: string, roleId: string) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.phoneNumber = phoneNumber
        this.department = department
        this.position = position
        this.image = image
        this.roleId = roleId
    }
    // tslint:disable-next-line:typedef
    setId(id: string | any) {
        this.id = id;
    }
    // tslint:disable-next-line:typedef
    getPassword() {
        return this.password;
    }
    getCollectionUri() {
        return 'http://localhost:3000/user'
    }
    getItemUri() {
        return 'http://localhost:3000/user/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }

}

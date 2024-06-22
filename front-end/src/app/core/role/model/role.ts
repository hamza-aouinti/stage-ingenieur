import { ApiResourceInterface } from "src/app/models/api-resource.interface";

export class Role implements ApiResourceInterface {
    id?: string;
    name: string;
    description: string;
    permissions: Array<string>

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.permissions = []
    }
// tslint:disable-next-line:typedef
setId(id: string|any) {
    this.id = id;
}
getCollectionUri() {
    return 'http://localhost:3000/role'
}
getItemUri() {
    return 'http://localhost:3000/role/' + this.id;
}
getSubResourceUri() {
    throw new Error("Method not implemented.");
}
}



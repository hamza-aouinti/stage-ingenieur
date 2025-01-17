import { ApiResourceInterface } from "../../../models/api-resource.interface";
import { User } from "../../../core/user/model/user";

export class Project implements ApiResourceInterface {
 
    public id?: string;
    public name: string;
    public description: string;
    public type: string;
    public startDate: Date;
    public endDate: Date;
    public users: Array<User>;
    public status: string;

    constructor(name: string, description: string, type: string, startDate: Date, endDate: Date, status: string) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.users = []
        this.status = status
    }

    // tslint:disable-next-line:typedef
    setId(id: string | any) {
        this.id = id;
    }
    getCollectionUri() {
        return 'http://localhost:3000/project'
    }
    getItemUri() {
        return 'http://localhost:3000/project/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }


}

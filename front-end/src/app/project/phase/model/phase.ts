import { ApiResourceInterface } from "src/app/models/api-resource.interface";

export class Phase implements ApiResourceInterface {
    public id?: string;
    public title: string;
    public description: string;
    public projectId: string;
    public startDate: string;
    public endDate: string;
    public status: string;
    public color: string;
 
    constructor(title: string, description: string, projectId: string, startDate: string, endDate: string, status: string, color: string) {
        this.title = title;
        this.description = description;
        this.projectId = projectId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.color = color;
    }

    // tslint:disable-next-line:typedef
    setId(id: string | any) {
        this.id = id;
    }
    getCollectionUri() {
        return 'http://localhost:3000/phase'
    }
    getItemUri() {
        return 'http://localhost:3000/phase/' + this.id;
    }
    getSubResourceUri() {
        throw new Error("Method not implemented.");
    }
}

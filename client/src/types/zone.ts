export interface Zone {

    id:number;

    name:string;

    zone_type:string;

    mower_count:number;

    status:string;

    geometry:any;

    acreage?:number;

    understaffed?:boolean;

}
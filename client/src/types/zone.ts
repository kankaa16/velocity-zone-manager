import type { Geometry } from "geojson";

export interface Zone {

    id: number;

    name: string;

    zone_type: string;

    mower_count: number;

    status: string;

    geometry: Geometry;

    acreage: number;

    recommended_mowers: number;

    understaffed: boolean;

    has_conflict?: boolean;

    conflicts_with?: number[];

}
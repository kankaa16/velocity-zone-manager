export interface Geometry {
    type: string;
    coordinates: number[][][];
}

export interface Zone {
    id: number;
    property_id: number;
    name: string;
    zone_type: string;
    mower_count: number;
    status: string;
    geometry: Geometry;
}

export interface PropertySummary {

    total_zones: number;

    total_mowers: number;

    active_zones: number;

    coverage: number;

}
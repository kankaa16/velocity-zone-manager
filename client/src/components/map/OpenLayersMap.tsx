import {

    useEffect,
    useRef,
    useState,

} from "react";

import Map from "ol/Map";
import View from "ol/View";

import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";

import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";

import GeoJSON from "ol/format/GeoJSON";

import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Select from "ol/interaction/Select";

import { click } from "ol/events/condition";

import { defaults } from "ol/control";

import { fromLonLat } from "ol/proj";

import {

    Fill,
    Stroke,
    Style,

} from "ol/style";

import type { Feature } from "ol";

import type { Property } from "../../types/property";
import type { Zone } from "../../types/zone";

import api from "../../api/axios";

import MapToolbar from "./MapToolbar";
import ZoneModal from "../zones/ZoneModal";
import SummaryCards from "../dashboard/SummaryCards";

import type { Geometry } from "geojson";


import "ol/ol.css";

interface Props {

    property: Property | null;

    selectedZone: Zone | null;

    setSelectedZone: React.Dispatch<
        React.SetStateAction<Zone | null>
    >;

    drawMode:boolean;

    setDrawMode: React.Dispatch<
        React.SetStateAction<boolean>
    >;

}

export default function OpenLayersMap({

    property,

    selectedZone,

    setSelectedZone,

    drawMode,

    setDrawMode,

}: Props) {

        const mapDiv = useRef<HTMLDivElement | null>(null);

    const map = useRef<Map | null>(null);

    const uploadInputRef =useRef<HTMLInputElement>(null);

    const source = useRef(

        new VectorSource()

    );

    const zoneStyles = {

    Fairway: new Style({

        fill: new Fill({
            color: "rgba(34,197,94,.25)"
        }),

        stroke: new Stroke({
            color: "#15803d",
            width: 3,
        }),

    }),

    Rough: new Style({

        fill: new Fill({
            color: "rgba(249,115,22,.22)"
        }),

        stroke: new Stroke({
            color: "#ea580c",
            width: 3,
        }),

    }),

    Perimeter: new Style({

        fill: new Fill({
            color: "rgba(37,99,235,.20)"
        }),

        stroke: new Stroke({
            color: "#2563eb",
            width: 3,
        }),

    }),

    Exclusion: new Style({

        fill: new Fill({
            color: "rgba(239,68,68,.18)"
        }),

        stroke: new Stroke({
            color: "#dc2626",
            width: 3,
        }),

    }),

    Default: new Style({

        fill: new Fill({
            color: "rgba(107,114,128,.18)"
        }),

        stroke: new Stroke({
            color: "#6b7280",
            width: 3,
        }),

    }),

};

    const layer = useRef(

    new VectorLayer({

        source: source.current,

        style: (feature) => {

            const type = feature.get("zone_type");

            return (

                zoneStyles[
                    type as keyof typeof zoneStyles
                ]

                ||

                zoneStyles.Default

            );

        },

    })

);

    const draw = useRef<Draw | null>(null);

    const modify = useRef<Modify | null>(null);

    const select = useRef<Select | null>(null);

    const [geometry, setGeometry] =
    useState<Geometry | null>(null);

    const [showModal, setShowModal] =

        useState(false);

    const zoneStyle = new Style({

        fill: new Fill({

            color: "rgba(34,197,94,0.25)",

        }),

        stroke: new Stroke({

            color: "#15803d",

            width: 3,

        }),

    });

    const selectedStyle = new Style({

        fill: new Fill({

            color: "rgba(59,130,246,0.30)",

        }),

        stroke: new Stroke({

            color: "#2563eb",

            width: 4,

        }),

    });
        useEffect(() => {

    layer.current.setStyle((feature) => {

        const baseStyle =
            zoneStyles[
                feature.get("zone_type") as keyof typeof zoneStyles
            ] || zoneStyles.Default;

        if (feature.get("id") === selectedZone?.id) {
            return selectedStyle;
        }

        return baseStyle;

    });

    if (!selectedZone) return;

    const feature = source.current
        .getFeatures()
        .find(
            (f) => f.get("id") === selectedZone.id
        );

    if (!feature) return;

    map.current?.getView().fit(
        feature.getGeometry()!.getExtent(),
        {
            duration: 500,
            padding: [100, 100, 100, 100],
            maxZoom: 15,
        }
    );

}, [selectedZone]);
        
        useEffect(() => {

        if (!mapDiv.current) return;

        if (map.current) return;

        map.current = new Map({

            target: mapDiv.current,

            controls: defaults(),

            layers: [

                new TileLayer({

                    source: new OSM(),

                }),

                layer.current,

            ],

            view: new View({

                center: fromLonLat([78.9629, 22.5937]),

                zoom: 5,

            }),

        });

    }, []);

        async function loadZones() {

        if (!property) {

            source.current.clear();

            return;

        }

        try {

            const res = await api.get(

                `/properties/${property.id}/zones`

            );
            console.log(res.data.data);

            source.current.clear();

            const format = new GeoJSON();

const features = format.readFeatures(
    {
        type: "FeatureCollection",
        features: res.data.data
            .filter((z:any)=>z.geometry)
            .map((zone:any)=>({

                type:"Feature",

                geometry:zone.geometry,

                properties:{

                    id:zone.id,

                    name:zone.name,

                    zone_type:zone.zone_type,

                    mower_count:zone.mower_count,

                    status:zone.status,
                    
                    acreage: zone.acreage,

                    recommended_mowers: zone.recommended_mowers,

                    understaffed: zone.understaffed,


                }

            }))
    },
    {
        dataProjection:"EPSG:4326",
        featureProjection:"EPSG:3857"
    }
);

source.current.clear();
source.current.addFeatures(features);

            if (features.length > 0) {

                const extent = source.current.getExtent();

if (
    extent &&
    extent.every(Number.isFinite)
) {

    map.current?.getView().fit(extent,{
        padding:[80,80,80,80],
        duration:700,
        maxZoom:17
    });

}

            }

            else {

                map.current?.getView().setCenter(

                    fromLonLat([78.9629, 22.5937])

                );

                map.current?.getView().setZoom(5);

            }

        }

        catch (err) {

            console.error(err);

        }

    }

    useEffect(() => {

        loadZones();

    }, [property]);

        useEffect(() => {

        if (!map.current) return;

        if (select.current) {

            map.current.removeInteraction(

                select.current

            );

        }

        select.current = new Select({

            condition: click,

            layers: [

                layer.current,

            ],

        });

        select.current.on(

            "select",

            (event) => {

                const feature =

                    event.selected[0] as Feature | undefined;

                if (!feature) {

                    setSelectedZone(null);

                    return;

                }

                const format = new GeoJSON();

const geojson = format.writeFeatureObject(feature, {
    featureProjection: "EPSG:3857",
    dataProjection: "EPSG:4326",
});

setSelectedZone({
    id: feature.get("id"),
    name: feature.get("name"),
    zone_type: feature.get("zone_type"),
    mower_count: feature.get("mower_count"),
    status: feature.get("status"),
    acreage: feature.get("acreage"),
    recommended_mowers: feature.get("recommended_mowers"),
    understaffed: feature.get("understaffed"),
    geometry: geojson.geometry,
});

            }

        );

        map.current.addInteraction(

            select.current

        );

    }, []);

        useEffect(() => {

        if (!map.current) return;

        if (draw.current) {

            map.current.removeInteraction(

                draw.current

            );

            draw.current = null;

        }

        if (!drawMode || !property)

            return;

        draw.current = new Draw({

            source: source.current,

            type: "Polygon",

        });

        draw.current.on(

    "drawend",

    (event) => {

        const format = new GeoJSON();

        const geojson =

            format.writeFeatureObject(

                event.feature,

                {

                    featureProjection:

                        "EPSG:3857",

                    dataProjection:

                        "EPSG:4326",

                }

            );

        setGeometry(

            geojson.geometry

        );

        setShowModal(true);

    }

);

        map.current.addInteraction(

            draw.current

        );

    }, [

        drawMode,

        property,

    ]);

        async function saveZone(data: {

        name: string;

        zone_type: string;

        mower_count: number;

        status: string;

    }) {

        if (!property || !geometry) return;

        try {

            await api.post(

                `/properties/${property.id}/zones`,

                {

                    name: data.name,

                    zone_type: data.zone_type,

                    mower_count: data.mower_count,

                    status: data.status,

                    geometry,

                }

            );

            setShowModal(false);

            setGeometry(null);

            await loadZones();

        }

        catch (err: any) {

            console.error(err);

            alert(

                err.response?.data?.message ||

                "Failed to save zone."

            );

        }
    }

        useEffect(() => {

    if (!map.current) return;

    if (modify.current) {

        map.current.removeInteraction(

            modify.current

        );

    }

    modify.current = new Modify({

        source: source.current,

    });

    modify.current.on(

        "modifyend",

        async (event) => {

            const feature = event.features.item(0);

            if (!feature) return;

            const format = new GeoJSON();

            const geojson = format.writeFeatureObject(

                feature,

                {

                    featureProjection: "EPSG:3857",

                    dataProjection: "EPSG:4326",

                }

            );

            try {

                await api.put(
    `/zones/${feature.get("id")}`,
    {
        name: feature.get("name"),
        zone_type: feature.get("zone_type"),
        mower_count: feature.get("mower_count"),
        status: feature.get("status"),
        geometry: geojson.geometry,
    }
);

await loadZones();

const res = await api.get(
    `/zones/${feature.get("id")}`
);

setSelectedZone(res.data.data);

            }

            catch (err) {

                console.error(err);

            }

        }

    );

    map.current.addInteraction(

        modify.current

    );

}, []);

    async function handleUpload(

        e: React.ChangeEvent<HTMLInputElement>

    ) {

        if (!property) {

            alert("Select a property first.");

            return;

        }

        const file = e.target.files?.[0];

        if (!file) return;

        try {

            const text = await file.text();

            const geojson = JSON.parse(text);

            await api.post(

                `/properties/${property.id}/zones/import`,

                geojson

            );

            await loadZones();

            alert("GeoJSON imported.");

        }

        catch (err) {

            console.error(err);

            alert("Invalid GeoJSON.");

        }

    }

    async function exportGeoJSON() {

        if (!property) return;

        try {

            const res = await api.get(

                `/properties/${property.id}/zones/export`

            );
            console.log(res.data.data);

            const blob = new Blob(

                [

                    JSON.stringify(

                        res.data.data,

                        null,

                        2

                    ),

                ],

                {

                    type: "application/json",

                }

            );

            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;

            a.download =

                `${property.name}.geojson`;

            a.click();

            URL.revokeObjectURL(url);

        }

        catch (err) {

            console.error(err);

        }

    }
    async function deleteSelectedZone() {

    if (!selectedZone) {

        alert("Select a zone first.");

        return;

    }

    if (!confirm("Delete this zone?")) return;

    try {

        await api.delete(

            `/zones/${selectedZone.id}`

        );

        setSelectedZone(null);

        await loadZones();

    }

    catch (err) {

        console.error(err);

    }

}
    return (

        <>

            <div

                ref={mapDiv}

                className="w-full h-full"

            />

            <SummaryCards
        propertyId={property?.id ?? null}
        />

            <MapToolbar

                drawMode={drawMode}

                setDrawMode={setDrawMode}

                onExport={exportGeoJSON}

                onDelete={deleteSelectedZone}

                uploadInputRef={uploadInputRef}

            />

            <input

                ref={uploadInputRef}

                hidden

                type="file"

                accept=".geojson,.json"

                onChange={handleUpload}

            />

            <ZoneModal

                open={showModal}

                onClose={() => {

                    setShowModal(false);

                    setGeometry(null);

                }}

                onSave={saveZone}

            />

        </>

    );



    }
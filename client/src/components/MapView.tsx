import { useEffect, useRef } from "react";

import Map from "ol/Map";
import View from "ol/View";

import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Draw from "ol/interaction/Draw";

import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";

import GeoJSON from "ol/format/GeoJSON";

import { defaults } from "ol/control";
import { fromLonLat } from "ol/proj";

import { Fill, Stroke, Style } from "ol/style";

import type { Property } from "../types/property";

import api from "../api/axios";

import "ol/ol.css";

interface Props {
    property: Property | null;

    drawMode: boolean;
}

export default function MapView({

    property,
    drawMode,

}: Props) {

    const mapDiv = useRef<HTMLDivElement | null>(null);

    const map = useRef<Map | null>(null);
        const drawInteraction = useRef<Draw | null>(null);


    useEffect(() => {

    if (!map.current) return;

    if (drawInteraction.current) {

        map.current.removeInteraction(
            drawInteraction.current
        );

        drawInteraction.current = null;

    }

    if (!drawMode) return;

    drawInteraction.current = new Draw({

        source: source.current,

        type: "Polygon",

    });

    map.current.addInteraction(
        drawInteraction.current
    );

}, [drawMode]);

    const source = useRef(

        new VectorSource()

    );

    const layer = useRef(

        new VectorLayer({

            source: source.current,

            style: new Style({

                fill: new Fill({

                    color: "rgba(34,197,94,0.25)",

                }),

                stroke: new Stroke({

                    color: "#15803d",

                    width: 3,

                }),

            }),

        })

    );

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

                center: fromLonLat([78.9629,22.5937]),

                zoom:5,

            }),

        });

    }, []);

    useEffect(() => {

    if (property === null) {

    source.current.clear();

    return;

    }
    const propertyId=property.id;

    async function loadZones() {

        try {

            const res = await api.get(
                `/properties/${propertyId}/zones`
            );

            console.log("Zones:", res.data);

            source.current.clear();

            const format = new GeoJSON();

for (const zone of res.data.data) {

    const features = format.readFeatures(
    {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: zone.geometry,
                properties: {
                    id: zone.id,
                    name: zone.name,
                },
            },
        ],
    },
    {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
    }
);

source.current.addFeatures(features);

}

            console.log(
                "Features:",
                source.current.getFeatures().length
            );

            if (source.current.getFeatures().length > 0) {

                const extent = source.current.getExtent();

if (extent) {

   map.current?.getView().fit(extent, {
    padding: [80, 80, 80, 80],
    duration: 800,
    maxZoom: 17,
});

}

            }

        }

        catch (err: any) {

    console.log(err.response?.status);

    console.log(err.response?.data);

    console.log(err);

}

    }

    loadZones();

}, [property]);
    


    return (

        <div

            ref={mapDiv}

            className="w-full h-full"

        />

    );

}
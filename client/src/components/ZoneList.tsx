import { useEffect, useState } from "react";
import {
    Map,
    Tractor,
    Circle,
} from "lucide-react";

import api from "../api/axios";

import type { Property } from "../types/property";
import type { Zone } from "../types/zone";

interface Props {

    property: Property | null;

}

export default function ZoneList({

    property,

}: Props) {

    const [zones, setZones] = useState<Zone[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!property) {

            setZones([]);

            return;

        }

        async function loadZones() {

            try {

                setLoading(true);

                const res = await api.get(

                    `/properties/${property.id}/zones`

                );

                setZones(res.data.data);

            }

            catch (err) {

                console.error(err);

            }

            finally {

                setLoading(false);

            }

        }

        loadZones();

    }, [property]);

    if (!property) {

        return (

            <div className="p-6 text-gray-500">

                Select a property.

            </div>

        );

    }

    if (loading) {

        return (

            <div className="p-6">

                Loading zones...

            </div>

        );

    }

    return (

        <div className="space-y-3 p-5">

            {

                zones.map((zone)=>(

                    <div

                        key={zone.id}

                        className="rounded-2xl border bg-white p-4 hover:border-green-700 transition"

                    >

                        <div className="flex justify-between">

                            <div>

                                <h3 className="font-semibold">

                                    {zone.name}

                                </h3>

                                <p className="text-sm text-gray-500">

                                    {zone.zone_type}

                                </p>

                            </div>

                            <Map

                                size={20}

                                className="text-green-700"

                            />

                        </div>

                        <div className="mt-4 flex justify-between text-sm">

                            <div className="flex items-center gap-2">

                                <Tractor size={16}/>

                                {zone.mower_count}

                            </div>

                            <div className="flex items-center gap-2">

                                <Circle

                                    size={10}

                                    fill={

                                        zone.status==="ACTIVE"

                                        ?

                                        "#22c55e"

                                        :

                                        "#facc15"

                                    }

                                />

                                {zone.status}

                            </div>

                        </div>

                    </div>

                ))

            }

            {

                zones.length===0 &&

                <div className="text-center text-gray-500 py-8">

                    No zones created.

                </div>

            }

        </div>

    );

}
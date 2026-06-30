import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import ZoneCard from "./ZoneCard";

import type { Property } from "../../types/property";
import type { Zone } from "../../types/zone";

interface Props {

    property: Property | null;

    search: string;

    selectedZone: Zone | null;

    onSelect: (zone: Zone) => void;

}

export default function ZoneList({

    property,

    search,

    selectedZone,

    onSelect,

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
                const propid=property?.id
                const res = await api.get(

                    `/properties/${propid}/zones`

                );

                setZones(

                    res.data.data ?? []

                );

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

    const filteredZones = useMemo(() => {

        return zones.filter((zone) =>

            zone.name

                .toLowerCase()

                .includes(search.toLowerCase())

            ||

            zone.zone_type

                .toLowerCase()

                .includes(search.toLowerCase())

        );

    }, [zones, search]);

    if (!property) {

        return (

            <div className="h-full flex items-center justify-center text-gray-400">

                Select a property

            </div>

        );

    }

    if (loading) {

        return (

            <div className="p-8 text-center">

                Loading zones...

            </div>

        );

    }

    if (filteredZones.length === 0) {

        return (

            <div className="p-8 text-center text-gray-500">

                No zones found.

            </div>

        );

    }

    return (

        <div className="p-4">

            {

                filteredZones.map((zone) => (

                    <ZoneCard

                        key={zone.id}

                        zone={zone}

                        selected={

                            selectedZone?.id === zone.id

                        }

                        onClick={() =>

                            onSelect(zone)

                        }

                    />

                ))

            }

        </div>

    );

}
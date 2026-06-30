import { useEffect, useState } from "react";

import {
    Map,
    Tractor,
    Save,
    Trash2,
    TriangleAlert,
} from "lucide-react";

import api from "../../api/axios";

import type { Property } from "../../types/property";
import type { Zone } from "../../types/zone";

interface Props {

    property: Property | null;

    zone: Zone | null;

}

export default function ZoneInspector({

    property,

    zone,

}: Props) {

    const [name, setName] = useState("");

    const [zoneType, setZoneType] = useState("");

    const [status, setStatus] = useState("");

    const [mowers, setMowers] = useState(1);

    useEffect(() => {

        if (!zone) return;

        setName(zone.name);

        setZoneType(zone.zone_type);

        setStatus(zone.status);

        setMowers(zone.mower_count);

    }, [zone]);

    async function save() {

        if (!zone) return;

        try {

            await api.put(

                `/zones/${zone.id}`,

                {

                    name,

                    zone_type: zoneType,

                    mower_count: mowers,

                    status,

                    geometry: zone.geometry,

                }

            );

            alert("Zone updated.");

        }

        catch (err) {

            console.error(err);

        }

    }

    async function remove() {

        if (!zone) return;

        if (!confirm("Delete this zone?")) return;

        try {

            await api.delete(

                `/zones/${zone.id}`

            );

            window.location.reload();

        }

        catch (err) {

            console.error(err);

        }

    }

    if (!property) {

        return (

            <aside className="w-[340px] border-l bg-white flex items-center justify-center text-gray-400">

                Select a property

            </aside>

        );

    }

    if (!zone) {

        return (

            <aside className="w-[340px] border-l bg-white flex items-center justify-center text-gray-400">

                Select a zone

            </aside>

        );

    }

    return (

        <aside className="w-[340px] border-l bg-white flex flex-col">

            {/* Header */}

            <div className="p-6 border-b">

                <h2 className="text-2xl font-bold">

                    Zone Inspector

                </h2>

                <p className="text-gray-500 mt-1">

                    Edit selected zone

                </p>

            </div>

            {/* Body */}

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                <div>

                    <label className="text-sm font-medium">

                        Zone Name

                    </label>

                    <input

                        value={name}

                        onChange={(e)=>

                            setName(e.target.value)

                        }

                        className="mt-2 w-full rounded-xl border px-4 py-3"

                    />

                </div>

                <div>

                    <label className="text-sm font-medium">

                        Zone Type

                    </label>

                    <select

                        value={zoneType}

                        onChange={(e)=>

                            setZoneType(e.target.value)

                        }

                        className="mt-2 w-full rounded-xl border px-4 py-3"

                    >

                        <option>Fairway</option>

                        <option>Rough</option>

                        <option>Perimeter</option>

                        <option>Exclusion</option>

                    </select>

                </div>

                <div>

                    <label className="text-sm font-medium">

                        Status

                    </label>

                    <select

                        value={status}

                        onChange={(e)=>

                            setStatus(e.target.value)

                        }

                        className="mt-2 w-full rounded-xl border px-4 py-3"

                    >

                        <option>Active</option>

                        <option>Inactive</option>

                    </select>

                </div>

                <div>

                    <label className="text-sm font-medium">

                        Assigned Mowers

                    </label>

                    <input

                        type="number"

                        min={1}

                        value={mowers}

                        onChange={(e)=>

                            setMowers(Number(e.target.value))

                        }

                        className="mt-2 w-full rounded-xl border px-4 py-3"

                    />

                </div>

                {/* Stats */}

                <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-gray-50 p-4">

                        <div className="flex items-center gap-2">

                            <Map

                                size={16}

                                className="text-green-700"

                            />

                            <span className="text-sm">

                                Area

                            </span>

                        </div>

                        <h3 className="font-bold text-xl mt-2">

                            {zone.acreage?.toFixed(2) ?? "--"} ac

                        </h3>

                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">

                        <div className="flex items-center gap-2">

                            <Tractor

                                size={16}

                                className="text-green-700"

                            />

                            <span className="text-sm">

                                Mowers

                            </span>

                        </div>

                        <h3 className="font-bold text-xl mt-2">

                            {mowers}

                        </h3>

                    </div>

                </div>

                {

                    zone.understaffed && (

                        <div className="rounded-xl border border-orange-300 bg-orange-50 p-4 flex gap-3">

                            <TriangleAlert

                                className="text-orange-600"

                            />

                            <div>

                                <p className="font-semibold text-orange-700">

                                    Understaffed

                                </p>

                                <p className="text-sm text-orange-600">

                                    Additional mower recommended.

                                </p>

                            </div>

                        </div>

                    )

                }

            </div>

            {/* Footer */}

            <div className="border-t p-5 flex gap-3">

                <button

                    onClick={save}

                    className="flex-1 rounded-xl bg-green-700 text-white py-3 flex justify-center items-center gap-2"

                >

                    <Save size={18}/>

                    Save

                </button>

                <button

                    onClick={remove}

                    className="rounded-xl border border-red-300 px-5 text-red-600"

                >

                    <Trash2 size={18}/>

                </button>

            </div>

        </aside>

    );

}
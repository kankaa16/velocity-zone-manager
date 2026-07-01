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
    const recommended = zone.recommended_mowers;

    const understaffed = mowers < recommended;

    const deficit = Math.max(0, recommended - mowers);

    return (

        <aside className="w-[340px] border-l bg-white flex flex-col">

            

            <div className="p-6 border-b">

                <h2 className="text-2xl font-bold">

                    Zone Inspector

                </h2>

                <p className="text-gray-500 mt-1">

                    Edit selected zone

                </p>

            </div>

            

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

                <div
    className={`rounded-xl border p-4 ${
        understaffed
            ? "border-orange-300 bg-orange-50"
            : "border-green-300 bg-green-50"
    }`}
>

    <p
        className={`font-semibold ${
            understaffed
                ? "text-orange-700"
                : "text-green-700"
        }`}
    >
        {understaffed
            ? "⚠ Fleet Recommendation"
            : "✓ Fleet Status"}
    </p>

    <div className="mt-3 space-y-1 text-sm">

        <p>
            Assigned:
            <span className="ml-2 font-semibold">
                {mowers}
            </span>
        </p>

        <p>
            Recommended:
            <span className="ml-2 font-semibold">
                {recommended}
            </span>
        </p>

        {
            understaffed ? (

                <p className="font-medium text-orange-700">

                    Needs{" "}
                    {
                        recommended -
                        mowers
                    }{" "}
                    more mower
                    {
                        recommended -
                        mowers >
                        1
                            ? "s"
                            : ""
                    }

                </p>

            ) : (

                <p className="font-medium text-green-700">

                    Fleet allocation is optimal.

                </p>

            )
        }

    </div>

</div>

            </div>

         

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
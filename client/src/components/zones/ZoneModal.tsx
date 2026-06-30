import { useEffect, useState } from "react";

interface Props {

    open: boolean;

    onClose: () => void;

    onSave: (data: {

        name: string;

        zone_type: string;

        mower_count: number;

        status: string;

    }) => void;

}

export default function ZoneModal({

    open,

    onClose,

    onSave,

}: Props) {

    const [name, setName] = useState("");

    const [zoneType, setZoneType] = useState("Fairway");

    const [status, setStatus] = useState("Active");

    const [mowers, setMowers] = useState(1);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!open) return;

        setName("");

        setZoneType("Fairway");

        setStatus("Active");

        setMowers(1);

        setError("");

    }, [open]);

    if (!open) return null;

    function submit() {

        if (!name.trim()) {

            setError("Zone name is required.");

            return;

        }

        if (mowers < 1) {

            setError("A zone must have at least one assigned mower.");

            return;

        }

        onSave({

            name,

            zone_type: zoneType,

            mower_count: mowers,

            status,

        });

    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-[500px] rounded-3xl bg-white shadow-2xl">

                <div className="border-b px-8 py-6">

                    <h2 className="text-2xl font-bold">

                        Create Zone

                    </h2>

                    <p className="mt-1 text-gray-500">

                        Configure the newly drawn polygon.

                    </p>

                </div>

                <div className="space-y-5 p-8">

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Zone Name

                        </label>

                        <input

                            value={name}

                            onChange={(e) => {

                                setName(e.target.value);

                                setError("");

                            }}

                            className="w-full rounded-xl border px-4 py-3 focus:border-green-700 focus:outline-none"

                            placeholder="North Fairway"

                        />

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="mb-2 block text-sm font-medium">

                                Zone Type

                            </label>

                            <select

                                value={zoneType}

                                onChange={(e) =>

                                    setZoneType(e.target.value)

                                }

                                className="w-full rounded-xl border px-4 py-3"

                            >

                                <option>Fairway</option>

                                <option>Rough</option>

                                <option>Perimeter</option>

                                <option>Exclusion</option>

                            </select>

                        </div>

                        <div>

                            <label className="mb-2 block text-sm font-medium">

                                Status

                            </label>

                            <select

                                value={status}

                                onChange={(e) =>

                                    setStatus(e.target.value)

                                }

                                className="w-full rounded-xl border px-4 py-3"

                            >

                                <option>Active</option>

                                <option>Inactive</option>

                            </select>

                        </div>

                    </div>

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Assigned Mowers

                        </label>

                        <input

                            type="number"

                            min={1}

                            value={mowers}

                            onChange={(e) => {

                                setMowers(Number(e.target.value));

                                setError("");

                            }}

                            className="w-full rounded-xl border px-4 py-3"

                        />

                    </div>

                    {error && (

                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                            {error}

                        </div>

                    )}

                </div>

                <div className="flex justify-end gap-3 border-t px-8 py-6">

                    <button

                        onClick={onClose}

                        className="rounded-xl border px-5 py-3 hover:bg-gray-100"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={submit}

                        className="rounded-xl bg-green-700 px-6 py-3 text-white hover:bg-green-800"

                    >

                        Save Zone

                    </button>

                </div>

            </div>

        </div>

    );

}
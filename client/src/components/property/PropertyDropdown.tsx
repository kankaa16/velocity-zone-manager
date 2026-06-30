import { useEffect, useState } from "react";
import { ChevronDown, MapPinned } from "lucide-react";

import api from "../../api/axios";

import type { Property } from "../../types/property";

interface Props {

    value: Property | null;

    onChange: (property: Property) => void;

}

export default function PropertyDropdown({

    value,

    onChange,

}: Props) {

    const [properties, setProperties] = useState<Property[]>([]);

    const [open, setOpen] = useState(false);

    useEffect(() => {

        async function load() {

            const res = await api.get("/properties");

            setProperties(res.data.data);

        }

        load();

    }, []);

    return (

        <div className="relative">

            <button

                onClick={() => setOpen(!open)}

                className="w-full rounded-xl border bg-white px-4 py-3 flex items-center justify-between"

            >

                <div className="flex items-center gap-3">

                    <MapPinned

                        size={18}

                        className="text-green-700"

                    />

                    <div className="text-left">

                        <p className="text-xs text-gray-500">

                            Selected Property

                        </p>

                        <p className="font-semibold">

                            {value?.name || "Choose Property"}

                        </p>

                    </div>

                </div>

                <ChevronDown size={18} />

            </button>

            {

                open && (

                    <div className="absolute mt-2 w-full rounded-xl border bg-white shadow-xl z-50 max-h-80 overflow-y-auto">

                        {

                            properties.map((property) => (

                                <button

                                    key={property.id}

                                    onClick={() => {

                                        onChange(property);

                                        setOpen(false);

                                    }}

                                    className="w-full px-4 py-3 text-left hover:bg-green-50 transition"

                                >

                                    <p className="font-medium">

                                        {property.name}

                                    </p>

                                    <p className="text-sm text-gray-500">

                                        {property.type}

                                    </p>

                                </button>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}
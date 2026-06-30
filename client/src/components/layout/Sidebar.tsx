import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import PropertyDropdown from "../property/PropertyDropdown";
import ZoneList from "../zones/ZoneList";

import type { Property } from "../../types/property";
import type { Zone } from "../../types/zone";

interface Props {

    property: Property | null;

    onPropertyChange: (property: Property) => void;

    selectedZone: Zone | null;

    onZoneSelect: (zone: Zone) => void;

}

export default function Sidebar({

    property,

    onPropertyChange,

    selectedZone,

    onZoneSelect,

}: Props) {

    const [search, setSearch] = useState("");

    const title = useMemo(

        () => "Zones",

        []

    );

    return (

        <aside className="w-[330px] bg-white border-r flex flex-col">

            {/* Header */}

            <div className="p-4 border-b">

                <PropertyDropdown

                    value={property}

                    onChange={onPropertyChange}

                />

            </div>

            {/* Search */}

            <div className="p-5">

                <div className="relative">

                    <Search

                        size={18}

                        className="absolute left-4 top-3.5 text-gray-400"

                    />

                    <input

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                        placeholder="Search zones..."

                        className="w-full rounded-xl border bg-gray-50 pl-11 pr-4 py-3 outline-none"

                    />

                </div>

            </div>

            {/* Title */}

            <div className="px-5 pb-3 flex items-center justify-between">

                <div>

                    <h2 className="font-bold text-xl">

                        {title}

                    </h2>

                    <p className="text-sm text-gray-500">

                        Selected Property Zones

                    </p>

                </div>

            </div>

            {/* Zone List */}

            <div className="flex-1 overflow-y-auto">

                <ZoneList

                    property={property}

                    search={search}

                    selectedZone={selectedZone}

                    onSelect={onZoneSelect}

                />

            </div>

        </aside>

    );

}
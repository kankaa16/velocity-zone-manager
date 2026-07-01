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

    search: string;
}

export default function Sidebar({

    property,

    onPropertyChange,

    selectedZone,

    onZoneSelect,

    search,

}: Props){


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
import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import OpenLayersMap from "../components/map/OpenLayersMap";
import ZoneInspector from "../components/zones/ZoneInspector";

import type { Property } from "../types/property";
import type { Zone } from "../types/zone";

export default function Dashboard() {
    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);

    const [selectedZone, setSelectedZone] =
        useState<Zone | null>(null);

    const [drawMode, setDrawMode] =
        useState(false);
    
    const [search, setSearch] = useState("");    

    return (
        <div className="h-screen flex flex-col bg-[#f7f7f3]">

            <Navbar
                drawMode={drawMode}
                setDrawMode={setDrawMode}
                property={selectedProperty}
                search={search}
                setSearch={setSearch}
            />

            <div className="flex flex-1 overflow-hidden">

                <Sidebar
                    property={selectedProperty}
                    onPropertyChange={setSelectedProperty}
                    selectedZone={selectedZone}
                    onZoneSelect={setSelectedZone}
                    search={search}

                />

                <div className="flex-1 relative">

                    <OpenLayersMap
    property={selectedProperty}
    selectedZone={selectedZone}
    setSelectedZone={setSelectedZone}
    drawMode={drawMode}
    setDrawMode={setDrawMode}
/>

                </div>

                <ZoneInspector
                    property={selectedProperty}
                    zone={selectedZone}
                />

            </div>

        </div>
    );
}
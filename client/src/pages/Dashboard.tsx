import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import SummaryCards from "../components/SummaryCards";
import ZoneList from "../components/ZoneList";

import type { Property } from "../types/property";

export default function Dashboard() {

    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);
console.log(selectedProperty);
    return (

        <div className="h-screen bg-[#F7F8F3] flex flex-col overflow-hidden">

            <Navbar />

            <div className="flex flex-1 overflow-hidden">

                <Sidebar

                    selectedProperty={selectedProperty}

                    onSelect={setSelectedProperty}

                />

                <main className="flex-1 flex flex-col">

                    <div className="flex-1 relative">
    <MapView property={selectedProperty} />
</div>

<div className="h-[320px] grid grid-cols-[360px_1fr] border-t">

    <div className="overflow-y-auto border-r bg-[#F7F8F3]">
        <ZoneList property={selectedProperty} />
    </div>

    <div className="overflow-y-auto">
        <SummaryCards property={selectedProperty} />
    </div>

</div>

                </main>

            </div>

        </div>

    );

}
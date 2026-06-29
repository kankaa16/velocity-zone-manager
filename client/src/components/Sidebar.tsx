import { useMemo, useState } from "react";
import {
    Building2,
    Plus,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import type { Property } from "../types/property";

import PropertyList from "./PropertyList";
import PropertyModal from "./PropertyModal";

interface SidebarProps {
    selectedProperty: Property | null;
    onSelect: (property: Property) => void;
}

export default function Sidebar({
    selectedProperty,
    onSelect,
}: SidebarProps) {

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);

    const [refresh, setRefresh] = useState(0);

    const title = useMemo(() => "Properties", []);

    return (

        <>
            <aside className="w-[340px] bg-white border-r border-gray-200 flex flex-col">

                {/* Header */}

                <div className="p-6 border-b border-gray-100">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">

                                {title}

                            </h2>

                            <p className="text-gray-500 mt-1">

                                Manage all properties

                            </p>

                        </div>

                        <button

                            onClick={() => setOpen(true)}

                            className="rounded-2xl bg-green-700 hover:bg-green-800 transition text-white p-4"

                        >

                            <Plus size={22} />

                        </button>

                    </div>

                </div>

                {/* Search */}

                <div className="p-5">

                    <div className="relative">

                        <Search

                            className="absolute left-4 top-3.5 text-gray-400"

                            size={18}

                        />

                        <input

                            value={search}

                            onChange={(e) => setSearch(e.target.value)}

                            placeholder="Search properties..."

                            className="w-full rounded-2xl border border-gray-300 bg-[#F8FAF8] pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-200 focus:border-green-700"

                        />

                    </div>

                </div>

                {/* Filter */}

                <div className="px-5">

                    <button className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 hover:bg-gray-50 transition">

                        <SlidersHorizontal size={18} />

                        Filter

                    </button>

                </div>

                {/* Property Count */}

                <div className="px-5 pt-5">

                    <div className="rounded-3xl bg-green-50 border border-green-100 p-5">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-gray-500">

                                    Total Properties

                                </p>

                                <h2 className="text-4xl font-bold text-green-700 mt-2">

                                    --

                                </h2>

                            </div>

                            <Building2

                                className="text-green-700"

                                size={38}

                            />

                        </div>

                    </div>

                </div>

                {/* List */}

                <div className="flex-1 overflow-y-auto mt-4">

                    <PropertyList

                        key={refresh}

                        search={search}

                        selectedProperty={selectedProperty}

                        onSelect={onSelect}

                    />

                </div>

            </aside>

            <PropertyModal

                open={open}

                onClose={() => setOpen(false)}

                onSuccess={() => {

                    setRefresh((v) => v + 1);

                }}

            />

        </>

    );

}
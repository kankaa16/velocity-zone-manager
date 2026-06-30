import {
    Map,
    Tractor,
    TriangleAlert,
} from "lucide-react";

import type { Zone } from "../../types/zone";

interface Props {

    zone: Zone;

    selected: boolean;

    onClick: () => void;

}

export default function ZoneCard({

    zone,

    selected,

    onClick,

}: Props) {

    const active = zone.status === "Active";

    // Placeholder until backend summary is ready
    const acreage = (zone as any).acreage ?? "--";

    const understaffed =
        (zone as any).understaffed ?? false;

    return (

        <button

            onClick={onClick}

            className={`

                w-full

                rounded-2xl

                border

                p-4

                mb-3

                text-left

                transition-all

                hover:shadow-md

                ${selected
                    ? "border-green-700 bg-green-50"
                    : "border-gray-200 bg-white"}

            `}

        >

            {/* Title */}

            <div className="flex items-start justify-between">

                <div>

                    <h3 className="font-semibold text-gray-900">

                        {zone.name}

                    </h3>

                    <p className="text-sm text-gray-500 mt-1">

                        {zone.zone_type}

                    </p>

                </div>

                <span

                    className={`

                        rounded-full

                        px-3

                        py-1

                        text-xs

                        font-semibold

                        ${active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"}

                    `}

                >

                    {zone.status}

                </span>

            </div>

            {/* Stats */}

            <div className="grid grid-cols-2 gap-3 mt-5">

                <div className="rounded-xl bg-gray-50 p-3">

                    <div className="flex items-center gap-2">

                        <Map

                            size={15}

                            className="text-green-700"

                        />

                        <span className="text-xs text-gray-500">

                            Area

                        </span>

                    </div>

                    <p className="font-semibold mt-1">

                        {acreage} ac

                    </p>

                </div>

                <div className="rounded-xl bg-gray-50 p-3">

                    <div className="flex items-center gap-2">

                        <Tractor

                            size={15}

                            className="text-green-700"

                        />

                        <span className="text-xs text-gray-500">

                            Mowers

                        </span>

                    </div>

                    <p className="font-semibold mt-1">

                        {zone.mower_count}

                    </p>

                </div>

            </div>

            {

                understaffed && (

                    <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2 flex items-center gap-2">

                        <TriangleAlert

                            size={16}

                            className="text-orange-600"

                        />

                        <span className="text-sm text-orange-700 font-medium">

                            Understaffed

                        </span>

                    </div>

                )

            }

        </button>

    );

}
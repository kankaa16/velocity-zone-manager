import {
    Building2,
    Trees,
    ChevronRight,
} from "lucide-react";

import type { Property } from "../types/property";

interface Props {

    property: Property;

    selected: boolean;

    onClick: () => void;

}

export default function PropertyCard({

    property,

    selected,

    onClick,

}: Props) {

    return (

        <div

            onClick={onClick}

            className={`

                mx-4
                mt-4
                rounded-2xl
                border
                cursor-pointer
                transition-all
                duration-300

                ${
                    selected

                        ? "bg-green-700 text-white border-green-700 shadow-xl"

                        : "bg-white border-gray-200 hover:border-green-600 hover:shadow-lg"

                }

            `}

        >

            <div className="p-5">

                <div className="flex justify-between">

                    <Building2

                        size={24}

                        className={selected ? "text-white" : "text-green-700"}

                    />

                    <ChevronRight />

                </div>

                <h2 className="mt-5 text-lg font-semibold">

                    {property.name}

                </h2>

                <p className="opacity-80">

                    {property.type}

                </p>

                <div className="mt-5 flex justify-between">

                    <div>

                        <span className="text-2xl font-bold">

                            {property.total_acreage}

                        </span>

                        <span className="ml-1">

                            acres

                        </span>

                    </div>

                    <Trees />

                </div>

            </div>

        </div>

    );

}
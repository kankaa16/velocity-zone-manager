import {
    Layers,
    Tractor,
    CheckCircle2,
    TrendingUp,
} from "lucide-react";

import { useEffect, useState } from "react";

import api from "../api/axios";

import type { Property } from "../types/property";
import type { PropertySummary } from "../types/zone";

interface Props {

    property: Property | null;

}

export default function SummaryCards({

    property,

}: Props) {

    const [summary, setSummary] = useState<PropertySummary | null>(null);

    useEffect(() => {

        if (!property) {

            setSummary(null);

            return;

        }

        async function loadSummary() {

            try {

                const res = await api.get(

                    `/properties/${property.id}/summary`

                );

                setSummary(res.data.data);

            }

            catch (err) {

                console.error(err);

            }

        }

        loadSummary();

    }, [property]);

    const cards = [

        {

            title: "Zones",

            value: summary?.total_zones ?? "--",

            subtitle: "Mapped Areas",

            color: "bg-green-50",

            icon: Layers,

        },

        {

            title: "Mowers",

            value: summary?.total_mowers ?? "--",

            subtitle: "Available",

            color: "bg-emerald-50",

            icon: Tractor,

        },

        {

            title: "Active",

            value: summary?.active_zones ?? "--",

            subtitle: "Running",

            color: "bg-lime-50",

            icon: CheckCircle2,

        },

        {

            title: "Coverage",

            value: summary

                ?

                `${summary.coverage}%`

                :

                "--",

            subtitle: "Efficiency",

            color: "bg-yellow-50",

            icon: TrendingUp,

        },

    ];

    return (

        <div className="bg-[#F7F8F3] p-6">

            <div className="grid grid-cols-4 gap-6">

                {

                    cards.map((card)=>{

                        const Icon = card.icon;

                        return(

                            <div

                                key={card.title}

                                className="rounded-3xl bg-white border border-gray-200 shadow-sm"

                            >

                                <div className="p-6">

                                    <div className="flex justify-between">

                                        <div>

                                            <p className="text-gray-500">

                                                {card.title}

                                            </p>

                                            <h2 className="mt-2 text-4xl font-bold">

                                                {card.value}

                                            </h2>

                                            <p className="text-gray-500 mt-1">

                                                {card.subtitle}

                                            </p>

                                        </div>

                                        <div className={`${card.color} p-4 rounded-2xl`}>

                                            <Icon

                                                size={24}

                                                className="text-green-700"

                                            />

                                        </div>

                                    </div>

                                </div>

                                <div className="h-1 bg-gradient-to-r from-green-700 to-green-400"/>

                            </div>

                        );

                    })

                }

            </div>

        </div>

    );

}
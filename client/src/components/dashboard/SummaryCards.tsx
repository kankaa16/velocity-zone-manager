import { useEffect, useState } from "react";

import {
    Map,
    Tractor,
    Activity,
    Leaf,
} from "lucide-react";

import api from "../../api/axios";

interface Props {
    propertyId: number | null;
}

interface Summary {
    total_zones: number;
    total_acreage: number;
    total_mowers: number;
    coverage: number;
}

export default function SummaryCards({
    propertyId,
}: Props) {
    const [summary, setSummary] =
        useState<Summary | null>(null);

    function formatAcres(acres: number) {
    if (acres >= 1000)
        return `${(acres / 1000).toFixed(1)}k ac`;

    return `${acres.toFixed(1)} ac`;
}    

    useEffect(() => {
        if (!propertyId) {
            setSummary(null);
            return;
        }

        async function loadSummary() {
            try {
                const res = await api.get(
                    `/properties/${propertyId}/zones/summary`
                );

                setSummary(res.data.data);
            } catch (err) {
                console.error(err);
            }
        }

        loadSummary();
    }, [propertyId]);

    if (!summary) return null;

    return (
        <div
            className="
                absolute
                bottom-5
                left-1/2
                -translate-x-1/2
                z-20
                flex
                items-center
                gap-2
            "
        >
            <Card
                icon={<Map size={15} />}
                label="Zones"
                value={summary.total_zones}
            />

            <Card
                icon={<Leaf size={15} />}
                label="Acres"
                value={formatAcres(summary.total_acreage)}
            />

            <Card
                icon={<Tractor size={15} />}
                label="Mowers"
                value={summary.total_mowers}
            />

            <Card
                icon={<Activity size={15} />}
                label="Coverage"
                value={`${summary.coverage}%`}
            />
        </div>
    );
}

function Card({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div
            className="
                w-28
                rounded-xl
                border
                border-gray-200
                bg-white/95
                backdrop-blur-md
                shadow-md
                px-3
                py-2
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-1
                    text-[11px]
                    text-gray-500
                "
            >
                {icon}
                <span>{label}</span>
            </div>

            <div
                className="
                    mt-1
                    text-xl
                    font-bold
                    leading-none
                    text-slate-900
                "
            >
                {value}
            </div>
        </div>
    );
}
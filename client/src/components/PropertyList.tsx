import {
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../api/axios";

import type { Property } from "../types/property";

import PropertyCard from "./PropertyCard";

interface PropertyListProps {

    search: string;

    selectedProperty: Property | null;

    onSelect: (property: Property) => void;

}

export default function PropertyList({

    search,

    selectedProperty,

    onSelect,

}: PropertyListProps) {

    const [properties, setProperties] = useState<Property[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    async function loadProperties() {

        try {

            setLoading(true);

            const res = await api.get("/properties");

            setProperties(res.data.data ?? []);

            setError("");

        }

        catch (err: any) {

    console.error("Properties Error:", err);

    console.log("Status:", err.response?.status);

    console.log("Data:", err.response?.data);

    console.log("URL:", err.config?.url);

    setError("Failed to load properties.");

}

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadProperties();

    }, []);

    const filteredProperties = useMemo(() => {

        return properties.filter((property) =>

            property.name
                .toLowerCase()
                .includes(search.toLowerCase())

            ||

            property.type
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [properties, search]);

    if (loading) {

        return (

            <div className="p-6 text-center text-gray-500">

                Loading properties...

            </div>

        );

    }

    if (error) {

        return (

            <div className="p-6 text-center text-red-500">

                {error}

            </div>

        );

    }

    if (filteredProperties.length === 0) {

        return (

            <div className="p-8 text-center">

                <h3 className="font-semibold text-gray-700">

                    No Properties Found

                </h3>

                <p className="text-sm text-gray-500 mt-2">

                    Create your first property using the + button.

                </p>

            </div>

        );

    }

    return (

        <div className="pb-5">

            {

                filteredProperties.map((property) => (

                    <PropertyCard

                        key={property.id}

                        property={property}

                        selected={selectedProperty?.id === property.id}

                        onClick={() => onSelect(property)}

                    />

                ))

            }

        </div>

    );

}
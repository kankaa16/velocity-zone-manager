import { useState } from "react";
import { X } from "lucide-react";

import api from "../api/axios";

interface PropertyModalProps {

    open: boolean;

    onClose: () => void;

    onSuccess: () => void;

}

export default function PropertyModal({

    open,

    onClose,

    onSuccess,

}: PropertyModalProps) {

    const [name, setName] = useState("");

    const [type, setType] = useState("Golf Course");

    const [acreage, setAcreage] = useState("");

    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    if (!open) return null;

    async function createProperty() {

        if (!name.trim()) {

            setError("Property name is required.");

            return;

        }

        if (!acreage) {

            setError("Total acreage is required.");

            return;

        }

        try {

            setLoading(true);

            setError("");

            await api.post("/properties", {

                name,

                type,

                total_acreage: Number(acreage),

                notes,

            });

            setName("");

            setType("Golf Course");

            setAcreage("");

            setNotes("");

            onSuccess();

            onClose();

        }

        catch (err: any) {

            setError(

                err?.response?.data?.message ||

                "Unable to create property."

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

            <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b p-6">

                    <h2 className="text-2xl font-bold">

                        Create Property

                    </h2>

                    <button

                        onClick={onClose}

                        className="rounded-xl p-2 hover:bg-gray-100"

                    >

                        <X size={22}/>

                    </button>

                </div>

                <div className="space-y-5 p-6">

                    <div>

                        <label className="text-sm font-medium">

                            Property Name

                        </label>

                        <input

                            value={name}

                            onChange={(e)=>setName(e.target.value)}

                            className="mt-2 w-full rounded-xl border px-4 py-3"

                        />

                    </div>

                    <div>

                        <label className="text-sm font-medium">

                            Property Type

                        </label>

                        <select

                            value={type}

                            onChange={(e)=>setType(e.target.value)}

                            className="mt-2 w-full rounded-xl border px-4 py-3"

                        >

                            <option>Golf Course</option>

                            <option>Airport</option>

                            <option>Corporate Campus</option>

                            <option>Other</option>

                        </select>

                    </div>

                    <div>

                        <label className="text-sm font-medium">

                            Total Acreage

                        </label>

                        <input

                            type="number"

                            value={acreage}

                            onChange={(e)=>setAcreage(e.target.value)}

                            className="mt-2 w-full rounded-xl border px-4 py-3"

                        />

                    </div>

                    <div>

                        <label className="text-sm font-medium">

                            Notes

                        </label>

                        <textarea

                            rows={4}

                            value={notes}

                            onChange={(e)=>setNotes(e.target.value)}

                            className="mt-2 w-full rounded-xl border px-4 py-3"

                        />

                    </div>

                    {

                        error &&

                        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-600">

                            {error}

                        </div>

                    }

                </div>

                <div className="flex justify-end gap-4 border-t p-6">

                    <button

                        onClick={onClose}

                        className="rounded-xl border px-5 py-3"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={createProperty}

                        disabled={loading}

                        className="rounded-xl bg-green-700 hover:bg-green-800 px-6 py-3 text-white"

                    >

                        {

                            loading

                            ?

                            "Creating..."

                            :

                            "Create Property"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}
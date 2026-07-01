import {
    LogOut,
    Search,
    MapPinned,
    Pencil,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { Property } from "../../types/property";

interface Props {
    property: Property | null;

    drawMode: boolean;

    setDrawMode: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    search: string;

    setSearch: React.Dispatch<
        React.SetStateAction<string>
    >;
}

export default function Navbar({

    property,

    drawMode,

    setDrawMode,

    search,

    setSearch

}: Props) {

    const navigate = useNavigate();

    function logout() {

        localStorage.removeItem("token");

        navigate("/");

    }

    return (

        <header className="h-16 border-b bg-white px-6 flex items-center justify-between">

    <div className="flex items-center gap-4 shrink-0">

        <div className="h-10 w-10 rounded-xl bg-green-700 flex items-center justify-center">
            <MapPinned size={22} className="text-white"/>
        </div>

        <div className="leading-none">
            <h1 className="text-2xl font-bold">
                Velocity Zone Manager
            </h1>

            <p className="text-xs text-gray-500 mt-1">
                Property Intelligence Platform
            </p>
        </div>

    </div>

    <div className="flex-1 flex justify-center px-8">

        <div className="relative w-full max-w-xl">

            <Search
                size={18}
                className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search zones or type..."
    className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 outline-none"
/>

        </div>

    </div>

 
    <div className="flex items-center gap-3 shrink-0">

        {property && (

            <div className="w-52 rounded-xl border border-gray-200 px-4 py-2">

                <p className="text-[11px] text-gray-500">
                    Property
                </p>

                <p className="truncate font-semibold">
                    {property.name}
                </p>

            </div>

        )}

       

        <button
            onClick={() => setDrawMode(!drawMode)}
            className="h-11 px-5 rounded-xl bg-green-700 text-white flex items-center gap-2"
        >
            <Pencil size={17}/>
            Draw
        </button>

        <button
            onClick={logout}
            className="h-11 px-5 rounded-xl bg-slate-900 text-white flex items-center gap-2"
        >
            <LogOut size={17}/>
            Logout
        </button>

    </div>

</header>

    );

}
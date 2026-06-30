import { Bell, LogOut, MapPinned, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {

    drawMode: boolean;

    setDrawMode: React.Dispatch<React.SetStateAction<boolean>>;

}


export default function Navbar({

    drawMode,

    setDrawMode,

}: NavbarProps) {

    const navigate = useNavigate();

    function logout() {

        localStorage.removeItem("token");

        navigate("/");

    }
    

    return (

        <header className="h-24 bg-white border-b border-gray-200 px-8 flex items-center justify-between">

            <div className="flex items-center gap-5">

                <div className="w-14 h-14 rounded-2xl bg-green-700 flex items-center justify-center shadow-lg">

                    <MapPinned
                        className="text-white"
                        size={30}
                    />

                </div>

                <div>

                    <h1 className="text-4xl font-bold text-gray-900">

                        Velocity Zone Manager

                    </h1>

                    <p className="text-gray-500">

                        Property Intelligence Platform

                    </p>

                </div>

            </div>

            <div className="flex items-center gap-6">

                <div className="relative">

                    <Search
                        className="absolute left-4 top-4 text-gray-400"
                        size={20}
                    />

                    <input

                        placeholder="Search property..."

                        className="w-[480px] rounded-2xl border border-gray-300 bg-[#F8FAF8] pl-12 pr-5 py-4 outline-none focus:ring-2 focus:ring-green-200 focus:border-green-700"

                    />

                </div>

                <button className="relative rounded-2xl border border-gray-300 p-4 hover:bg-gray-50 transition">

                    <Bell size={24} />

                    <span className="absolute right-3 top-3 h-3 w-3 rounded-full bg-green-500" />

                </button>
                <button

    onClick={() => setDrawMode(v => !v)}

>

    {drawMode ? "Stop Drawing" : "Draw Zone"}

</button>
                
                <button

                    onClick={logout}

                    className="flex items-center gap-3 rounded-2xl bg-green-700 hover:bg-green-800 transition text-white px-8 py-4"

                >

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </header>

    );

}
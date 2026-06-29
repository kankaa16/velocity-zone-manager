import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPinned,
    Eye,
    EyeOff,
    ArrowRight,
} from "lucide-react";

import api from "../api/axios";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function login() {

        try {

            setLoading(true);

            setError("");

            const res = await api.post("/auth/login", {

                email,

                password,

            });

            localStorage.setItem(
                "token",
                res.data.data.token
            );

            navigate("/dashboard");

        }

        catch {

            setError("Invalid email or password.");

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="min-h-screen bg-[#F7F8F3] flex">

            {/* LEFT */}

            <section className="hidden lg:flex w-[45%] bg-[#2E7D32] relative">

                <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff18_1px,transparent_1px)] bg-[length:28px_28px]" />

                <div className="relative z-10 flex flex-col justify-center px-16 text-white">

                    <MapPinned size={52} />

                    <h1 className="mt-8 text-5xl font-bold">

                        Velocity

                    </h1>

                    <h2 className="text-3xl font-light">

                        Zone Manager

                    </h2>

                    <p className="mt-8 text-lg leading-8 text-green-50">

                        Intelligent GIS tools for managing
                        commercial properties, operational zones
                        and field workforce.

                    </p>

                    <div className="mt-14 space-y-5">

                        <Feature title="Interactive Maps" />

                        <Feature title="GeoJSON Import & Export" />

                        <Feature title="Zone Analytics" />

                    </div>

                </div>

            </section>

            {/* RIGHT */}

            <section className="flex-1 flex items-center justify-center p-12">

                <div className="w-full max-w-md">

                    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10">

                        <h2 className="text-3xl font-semibold">

                            Welcome Back

                        </h2>

                        <p className="mt-2 text-gray-500">

                            Sign in to continue

                        </p>

                        <div className="mt-8">

                            <label className="text-sm font-medium">

                                Email

                            </label>

                            <input

                                value={email}

                                onChange={(e)=>setEmail(e.target.value)}

                                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-700 focus:ring-2 focus:ring-green-200 outline-none"

                                placeholder="you@example.com"

                            />

                        </div>

                        <div className="mt-6">

                            <label className="text-sm font-medium">

                                Password

                            </label>

                            <div className="relative mt-2">

                                <input

                                    type={showPassword ? "text" : "password"}

                                    value={password}

                                    onChange={(e)=>setPassword(e.target.value)}

                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-green-700 focus:ring-2 focus:ring-green-200 outline-none"

                                />

                                <button

                                    className="absolute right-4 top-4"

                                    onClick={()=>setShowPassword(!showPassword)}

                                    type="button"

                                >

                                    {

                                        showPassword

                                            ?

                                            <EyeOff size={20}/>

                                            :

                                            <Eye size={20}/>

                                    }

                                </button>

                            </div>

                        </div>

                        {

                            error &&

                            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-600 p-3">

                                {error}

                            </div>

                        }

                        <button

                            disabled={loading}

                            onClick={login}

                            className="mt-8 w-full rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] transition text-white py-3 flex justify-center items-center gap-2"

                        >

                            {

                                loading

                                ?

                                "Signing In..."

                                :

                                <>

                                    Sign In

                                    <ArrowRight size={18}/>

                                </>

                            }

                        </button>

                    </div>

                </div>

            </section>

        </div>

    );

}

function Feature({

    title,

}:{

    title:string;

}){

    return(

        <div className="flex items-center gap-3">

            <div className="w-2 h-2 rounded-full bg-white"/>

            <p className="text-lg">

                {title}

            </p>

        </div>

    );

}
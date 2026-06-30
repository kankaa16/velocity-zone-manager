import {
    Pencil,
    Move,
    Trash2,
    Upload,
    Download,
    MousePointer2,
} from "lucide-react";


interface Props {

    drawMode:boolean;

    setDrawMode:React.Dispatch<
        React.SetStateAction<boolean>
    >;

    onExport:()=>void;

    onDelete:()=>void;

    uploadInputRef:
        React.RefObject<HTMLInputElement | null>;

}

export default function MapToolbar({

    drawMode,

    setDrawMode,

    onExport,

    onDelete,

    uploadInputRef

}: Props) {
    return (

        <div

            className="absolute

            left-1/2

            top-5

            -translate-x-1/2

            z-40

            rounded-2xl

            border

            bg-white

            shadow-xl

            flex

            items-center

            gap-2

            p-2"

        >

            <button

                onClick={() =>

                    setDrawMode(v => !v)

                }

                className={`

                    flex

                    items-center

                    gap-2

                    rounded-xl

                    px-4

                    py-3

                    transition

                    ${drawMode

                        ? "bg-green-700 text-white"

                        : "hover:bg-gray-100"}

                `}

            >

                <Pencil size={18}/>

                Draw

            </button>

            <button

                className="rounded-xl p-3 hover:bg-gray-100"

            >

                <MousePointer2 size={18}/>

            </button>

            <button

                className="rounded-xl p-3 hover:bg-gray-100"

            >

                <Move size={18}/>

            </button>

            <button

                onClick={onDelete}

                className="rounded-xl p-3 hover:bg-red-50 text-red-600"

            >

                <Trash2 size={18}/>

            </button>

            <div className="w-px h-8 bg-gray-200"/>

            <button

    onClick={() =>

        uploadInputRef.current?.click()

    }

>

                <Upload size={18}/>

            </button>

            <button

                onClick={onExport}

                className="rounded-xl p-3 hover:bg-gray-100"

            >

                <Download size={18}/>

            </button>

        </div>

    );

}
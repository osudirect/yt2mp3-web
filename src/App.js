import { useEffect, useRef, useState } from 'react';
import env from 'react-dotenv';

function App() {

    const ytInput = useRef(null);
    const stInput = useRef(null);
    const a = useRef(null);
    const progress = useRef(null);
    const bytes = useRef(null);
    const [xhr, setXhr] = useState(undefined);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [storageRes, setStorageRes] = useState([]);

    function formatBytes(bytes) {
        let b = bytes
        const types = ["B", "KB", "MB", "GB", "TB"]
        let p = 0;

        while (b > 1024) {
            b = b / 1024
            p++
        }

        return b.toFixed(2) + types[p]
    }

    useEffect(() => {
        StorageSearch();
    }, []);

    useEffect(() => {
        if (xhr == undefined) return;
        try {
            const value = ytInput.current.value;
            const url = new URL(value);
            const code = url.searchParams.get("v");
            xhr.open("GET", `${env.apiEndpoint}/${code}`, true);
            xhr.responseType = 'blob';
            let totalSize;
            let titleLet;
            xhr.onprogress = (e) => {
                if (!totalSize) {
                    totalSize = formatBytes(e.total);
                    titleLet = decodeURI(xhr.getResponseHeader("title"));
                    setTitle(titleLet);
                    setImage(xhr.getResponseHeader("thumbnail"));
                }
                progress.current.value = e.loaded / e.total;
                bytes.current.innerHTML = `${formatBytes(e.loaded)}/${totalSize}`
            }
            xhr.onloadend = () => {
                if (xhr.status == 200) {
                    const aUrl = URL.createObjectURL(xhr.response);;
                    a.current.href = aUrl;
                    a.current.download = titleLet + ".mp3";
                    a.current.click();
                    URL.revokeObjectURL(aUrl);
                    StorageSearch();
                }
            }
            xhr.onabort = CloseXhr;
            xhr.send();
        } catch (err) {
            CloseXhr();
            console.error(err);
        }
    }, [xhr]);

    async function DownloadStorage(id) {
        ytInput.current.value = "https://youtube.com/watch?v=" + id;
        setXhr(new XMLHttpRequest());
    }

    async function YouTubeSearch(e) {
        e.preventDefault();
        setXhr(new XMLHttpRequest());
    }

    async function StorageSearch(e) {
        e?.preventDefault();
        const query = stInput.current.value;
        const res = await fetch(`${env.apiEndpoint}/search?q=${query}`);
        const data = await res.json();
        setStorageRes(data.reverse());
    }

    function AbortDownload() {
        xhr?.abort();
    }

    function CloseXhr() {
        setXhr(undefined);
        setTitle("");
        setImage("");
        progress.current.value = 0;
        bytes.current.innerHTML = "";
        StorageSearch();
    }

    return (<>
        <div className="absolute inset-0 m-auto max-w-xs sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }} />
        <div className="p-8 w-full min-h-screen backdrop-blur-[357px] overflow-y-scroll">
            <div className='w-full h-screen flex flex-col items-center justify-center gap-20 grow'>
                <div className='flex flex-col items-center justify-center gap-4'>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Unnamed</span> YouTube to mp3 downloader
                    </h1>
                    <a href='https://github.com/osudirect/yt2mp3' target="_blank"
                        className="hover:link text-xl flex flex-row gap-2 items-center">
                        <svg className='fill-base-content size-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
                            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                        </svg>
                        <span>
                            by <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">catboy.best</span>
                        </span>
                    </a>
                </div>
                <div className='w-full grid gap-6 pb-48'>
                    <div className='w-full'>
                        <div className='mx-auto max-w-[500px]'>
                            <form className='w-full join' onSubmit={YouTubeSearch}>
                                <input ref={ytInput} type="text" className="border-none join-item input input-bordered grow"
                                    placeholder="YouTube url..." name="youtube" />
                                <a ref={a} className="hidden" />
                                <button className="join-item btn btn-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                            clipRule="evenodd" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className={`${xhr ? "flex" : "hidden"} flex-col items-center gap-2`}>
                        <div className="card w-[500px] bg-base-100 shadow-xl">
                            <figure><img className="h-64 w-full object-cover" src={image} /></figure>
                            <div className="card-body p-4 flex flex-col items-center">
                                <h2 className="card-title">{title}</h2>
                                <label className='text-center' ref={bytes} />
                                <div className='w-full flex flex-row gap-4 items-center'>
                                    <button className="btn btn-error btn-sm btn-circle" onClick={AbortDownload}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="size-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <progress ref={progress} className="grow progress progress-success" value={0} max={1} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="-mt-28 mx-auto max-w-[1000px] px-4 py-3 gap-3 flex flex-col rounded-xl bg-base-200">
                <div className='flex flex-row justify-between'>
                    <div className="text-2xl font-bold flex flex-row gap-2 items-center">
                        <svg className='fill-base-content size-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" />
                        </svg>
                        <span>
                            Storage
                        </span>
                    </div>
                    <form onSubmit={StorageSearch}>
                        <label className="input input-sm input-bordered flex items-center gap-2">
                            <input ref={stInput} type="text" className="grow" placeholder="Search" />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label>
                    </form>
                </div>
                <div className='flex flex-col gap-4'>
                    {storageRes.map((song, i) => (
                        <div key={i} className="bg-neutral bg-opacity-30 shadow-xl h-24 flex flex-row items-center pe-4 rounded-lg">
                            <img loading='lazy' className="h-24 rounded-xl object-cover" src={song.videoDetails.thumbnails[0]?.url} />
                            <div className="flex flex-col p-4">
                                <h2 className="text-lg">{song.videoDetails.title}</h2>
                            </div>
                            <button onClick={() => DownloadStorage(song.id)} className="btn btn-secondary ms-auto">
                                <svg className='fill-base-100 size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>);
}

export default App;

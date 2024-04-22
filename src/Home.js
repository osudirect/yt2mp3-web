import { useEffect, useRef, useState } from 'react';
import env from 'react-dotenv';
import { Link } from 'react-router-dom';

function Home() {

    const ytInput = useRef(null);
    const a = useRef(null);
    const progress = useRef(null);
    const bytes = useRef(null);
    const [xhr, setXhr] = useState(undefined);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [recent, setRecent] = useState([]);

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
        GetRecent();
    }, []);

    useEffect(() => {
        if (xhr == undefined) return;
        try {
            const value = ytInput.current.value;
            const url = new URL(value);
            const code = url.searchParams.get("v");
            xhr.open("GET", `${env.apiEndpoint}/${code}`, true);
            xhr.responseType = 'arraybuffer';
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
                    const aUrl = URL.createObjectURL(new Blob([xhr.response], {
                        type: "audio/mpeg"
                    }));
                    a.current.href = aUrl;
                    a.current.download = titleLet + ".mp3";
                    a.current.click();
                    URL.revokeObjectURL(aUrl);
                    GetRecent();
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

    async function GetRecent(e) {
        e?.preventDefault();
        const res = await fetch(`${env.apiEndpoint}/search`);
        const data = await res.json();
        setRecent(data.reverse());
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
        GetRecent();
    }

    return (<>
        <Link to={"/search"} className="absolute top-8 left-8">
            <button className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="fill-primary-content size-4">
                    <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd" />
                </svg>
                Search
            </button>
        </Link>
        <div className='flex flex-col justify-center gap-20 grow'>
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
            <div className='w-full grid gap-6'>
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
        <div>
            <div className="mx-auto max-w-[1000px] px-4 py-3 gap-3 flex flex-col rounded-xl bg-base-200">
                <div className='flex flex-row justify-between'>
                    <div className="text-xl font-bold flex flex-row gap-2 items-center">
                        <svg className='fill-base-content size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                        </svg>
                        <span>
                            Recent
                        </span>
                    </div>
                </div>
                <div className='flex flex-col gap-4'>
                    {recent.map((song, i) => (
                        <div key={i} className="bg-neutral bg-opacity-30 shadow-xl grid grid-cols-1 md:grid-cols-3 items-center rounded-lg">
                            <img loading='lazy' className="col-span-1 h-24 w-full rounded-xl object-cover" src={song.videoDetails.thumbnails[0]?.url} />
                            <div className='col-span-1 md:col-span-2 justify-between flex flex-row items-center p-4 gap-4'>
                                <div className="flex flex-col">
                                    <h2 className="card-title">{song.videoDetails.title}</h2>
                                    <h4 className="text-lg">{song.videoDetails.ownerChannelName}</h4>
                                </div>
                                <button onClick={() => DownloadStorage(song.id)} className="btn btn-secondary">
                                    <svg className='fill-base-100 size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>);
}

export default Home;

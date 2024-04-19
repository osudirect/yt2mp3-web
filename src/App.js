import { useEffect, useRef, useState } from 'react';
import env from 'react-dotenv';

function App() {

    const ytInput = useRef(null);
    const a = useRef(null);
    const progress = useRef(null);
    const bytes = useRef(null);
    const [xhr, setXhr] = useState(undefined);

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
        if (xhr == undefined) return;
        try {
            const value = ytInput.current.value;
            const url = new URL(value);
            const code = url.searchParams.get("v");
            const api = env.apiEndpoint;
            xhr.open("GET", `${api}/${code}`, true);
            xhr.responseType = 'blob';
            let totalSize;
            xhr.onprogress = (e) => {
                if (!totalSize) totalSize = formatBytes(e.total);
                progress.current.value = e.loaded / e.total;
                bytes.current.innerHTML = `${formatBytes(e.loaded)}/${totalSize}`
            }
            xhr.onloadend = () => {
                if (xhr.status == 200) {
                    const aUrl = URL.createObjectURL(xhr.response);;
                    a.current.href = aUrl;
                    a.current.download = decodeURI(xhr.getResponseHeader("title"));
                    a.current.click();
                    URL.revokeObjectURL(aUrl);
                }
            }
            xhr.onabort = CloseXhr;
            xhr.send();
        } catch (err) {
            CloseXhr();
            console.error(err);
        }
    }, [xhr])

    async function YouTubeSearch(e) {
        e.preventDefault();
        setXhr(new XMLHttpRequest());
    }

    function AbortDownload() {
        xhr?.abort();
    }

    function CloseXhr() {
        setXhr(undefined);
        progress.current.value = 0;
        bytes.current.innerHTML = "";
    }

    return (<>
        <div className="absolute inset-0 m-auto max-w-xs sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }} />
        <div className="p-8 w-full min-h-screen backdrop-blur-[357px] overflow-y-scroll">
            <div className='w-full h-screen flex flex-col items-center justify-center gap-20 grow'>
                <div className='flex flex-col items-center justify-center gap-4'>
                    <h1 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Random</span> YouTube to mp3 downloader
                    </h1>
                    <h3 className="text-xl">powered by by <a className="link text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">catboy.best</a></h3>
                </div>
                <div className='w-full grid gap-4'>
                    <div className='w-full'>
                        <div className='mx-auto max-w-[500px]'>
                            <form className='w-full join' onSubmit={YouTubeSearch}>
                                <input ref={ytInput} type="text" className="join-item input input-bordered grow"
                                    placeholder="YouTube url..." name="youtube" />
                                <a ref={a} className="hidden" />
                                <button className="join-item btn btn-secondary">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4 opacity-70">
                                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                            clipRule="evenodd" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className={`${xhr ? "flex" : "hidden"} flex-col items-center gap-2`}>
                        <div className='flex flex-row gap-4 items-center'>
                            <button className="btn btn-error btn-sm btn-circle" onClick={AbortDownload}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <progress ref={progress} className="grow progress progress-success" value={0} max={1} />
                        </div>
                        <label ref={bytes} />
                    </div>
                </div>
            </div>
            <div className="-mt-28 mx-auto max-w-[1000px] collapse collapse-arrow bg-base-200">
                <input type="checkbox" name="storage" defaultChecked />
                <div className="collapse-title text-2xl font-bold">
                    Storage
                </div>
                <div className="collapse-content flex flex-col gap-4 justify-start items-center">
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                    <p>hello</p>
                </div>
            </div>
        </div>
    </>);
}

export default App;

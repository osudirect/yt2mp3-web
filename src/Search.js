import env from "react-dotenv";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";

function Search() {

    const len = 24;

    const [searchValue, setSearchValue] = useState("");
    const [storageRes, setStorageRes] = useState([]);

    const debounced = useDebouncedCallback(StorageSearch, 500);

    useEffect(() => {
        StorageSearch();
    }, [])

    async function StorageSearch(value, newSearch = true) {
        if (value) setSearchValue(value);
        try {
            const res = await fetch(`${env.apiEndpoint}/search?q=${value || searchValue}&limit=${len}&offset=${newSearch ? 0 : storageRes.length}`);
            const data = await res.json();
            setStorageRes(newValue ? data : [...storageRes, ...data]);
        } catch (err) {
            console.error(err);
            setStorageRes([]);
        }
    }

    function secondsToTime(secs) {
        let hours = String(Math.floor(secs / 3600));
        let minutes = String(Math.floor(secs / 60) % 60);
        let seconds = String(Math.floor(secs % 60));
        if(hours > 0) return `${hours}:${minutes.padStart(2, 0)}:${seconds.padStart(2, 0)}`
        return `${minutes}:${seconds.padStart(2, 0)}`
    }

    return <>
        <div className="flex flex-row gap-8">
            <Link to={"/"}>
                <button className="btn btn-primary">
                    <svg className="fill-primary-content size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                    Back
                </button>
            </Link>
            <label className="grow input input-bordered flex items-center gap-2">
                <input onChange={(e) => debounced(e.target.value)} type="text" className="grow" placeholder="Search" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {storageRes.map((song, i) => (
                <div key={i} className="card bg-base-100 shadow-xl">
                    <figure><img className="h-64 w-full object-cover" src={song.videoDetails.thumbnails[0].url} /></figure>
                    <div className="card-body flex flex-col flex-wrap p-4 gap-4">
                        <div className="grow">
                            <h2 className="card-title">{song.videoDetails.title}</h2>
                            <div className="flex flex-row gap-4 justify-between">
                                <h4 className="text-lg">{song.videoDetails.ownerChannelName}</h4>
                                <div className="badge badge-secondary">{secondsToTime(song.videoDetails.lengthSeconds)}</div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <a href={`${env.apiEndpoint}/${song.id}`} className="grow btn btn-secondary">
                                <svg className='fill-base-100 size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                                </svg>
                            </a>
                            <a href={`https://youtube.com/watch?v=${song.id}`} target="_blank" className="grow btn btn-error">
                                <svg className='fill-base-100 size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                    <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <button className="btn btn-primary"
            disabled={storageRes.length % len != 0}
            onClick={() => StorageSearch(undefined, false)}>
            Load More
        </button>
    </>;
}
export default Search;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";

function App() {
    return (<>
        <div className="absolute inset-0 m-auto max-w-xs sm:max-w-md md:max-w-lg" style={{ background: "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)" }} />
        <div className="p-8 w-screen h-screen flex flex-col gap-8 backdrop-blur-[357px] overflow-y-scroll">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/store" element={<Search />} />
                </Routes>
            </BrowserRouter>
        </div>
    </>);
}

export default App;

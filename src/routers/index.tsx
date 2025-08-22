
import Home from "@/page/Home/HomePage";
import { Route, Routes } from "react-router-dom";


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    );
}

export default AppRouter;
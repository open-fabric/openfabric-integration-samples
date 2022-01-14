import { Main } from "./Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PaymentSuccess } from "./PaymentSuccess";
import { PaymentFailed } from "./PaymentFailed";

export const App = () =>
    (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="PaymentSuccess" element={<PaymentSuccess/>}/>
                <Route path="PaymentFailed" element={<PaymentFailed/>}/>
            </Routes>
        </BrowserRouter>
    );

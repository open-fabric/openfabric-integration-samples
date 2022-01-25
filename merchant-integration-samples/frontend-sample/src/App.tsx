import {BrowserRouter, Routes, Route} from "react-router-dom";
import {PaymentSuccess} from "./PaymentSuccess";
import {PaymentFailed} from "./PaymentFailed";
import {BackendSample} from "./BackendSample";
import {FillSample} from "./FillSample";

export const App = () =>
    (
        <div className="App">
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<FillSample/>}/>
                        <Route path="/backend" element={<BackendSample/>}/>
                        <Route path="PaymentSuccess" element={<PaymentSuccess/>}/>
                        <Route path="PaymentFailed" element={<PaymentFailed/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );

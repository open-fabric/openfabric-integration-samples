import {BrowserRouter, Routes, Route} from "react-router-dom";
import {PaymentSuccess} from "./PaymentSuccess";
import {PaymentFailed} from "./PaymentFailed";
import {BackendSample} from "./BackendSample";
import {FillSample} from "./FillSample";
import {PGSample} from "./PGSample";

export const App = () =>
  (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<FillSample/>}/>
            <Route path="/backend" element={<BackendSample/>}/>
            <Route path="/pg" element={<PGSample/>}/>
            <Route path="/backend/PaymentSuccess" element={<PaymentSuccess/>}/>
            <Route path="/backend/PaymentFailed" element={<PaymentFailed/>}/>
            <Route path="/pg/PaymentSuccess" element={<PaymentSuccess/>}/>
            <Route path="/pg/PaymentFailed" element={<PaymentFailed/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );

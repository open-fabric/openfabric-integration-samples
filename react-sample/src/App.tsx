import { FillSampleApp } from "./FillSampleApp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PaymentSuccess } from "./PaymentSuccess";
import { PaymentFailed } from "./PaymentFailed";
import {BackendSampleApp} from "./BackendSampleApp";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FillSampleApp />} />
        <Route path="/backend" element={<BackendSampleApp />} />
        <Route path="PaymentSuccess" element={<PaymentSuccess />} />
        <Route path="PaymentFailed" element={<PaymentFailed />} />
      </Routes>
    </BrowserRouter>
  );
};

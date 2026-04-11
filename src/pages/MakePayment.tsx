import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function MakePayment() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Make Payment</h1>
      <button onClick={() => navigate("/make-payment/showtimes")}>
        Thanh toán
      </button>
    </div>
  );
}
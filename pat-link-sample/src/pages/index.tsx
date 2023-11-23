import React, { useState } from 'react';


export default function Form() {
    const [currency, setCurrency] = useState('SGD');
    const [amount, setAmount] = useState('100');
    const [description, setDescription] = useState('Weekly subscriptions');
    const [frequency, setFrequency] = useState('weekly');

    const handleSubmit = async (event:any) => {
        event.preventDefault();

        const data = {
            currency,
            amount,
            description,
            frequency
        };

        const response = await fetch('/merchant-pat-link/api/link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const  url = await response.text();

            window.location.href = url;
        } else {
            console.error('Form submission failed.');
        }
    };

    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit}>
                <legend>Subscribe for goods</legend>
                <label>
                    Currency:
                    <input
                        type="text"
                        value={currency}
                        onChange={(event) => setCurrency(event.target.value)}
                    />
                </label>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </label>
                <label>
                    Frequency:
                    <select value={frequency} onChange={(event) => setFrequency(event.target.value)}>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>
            <style jsx>{`
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        input,
        textarea,
        button,
        select {
          padding: 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #ccc;
        }

        button[type='submit'] {
          background-color: #0070f3;
          color: #fff;
          border-color: #0070f3;
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .form-container {
            flex-direction: row;
            gap: 2rem;
            align-items: center;
            justify-content: center;
          }

          form {
            width: 50%;
            gap: 2rem;
          }
        }
      `}</style>
        </div>
    );
}
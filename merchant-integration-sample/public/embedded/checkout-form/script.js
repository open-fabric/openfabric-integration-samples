window.onload = updateDefaultValue; // Runs the function on click
function updateDefaultValue() {
  const refId = `MER-${Date.now()}`;
  const merchantRef = document.getElementById("merchant_reference_id");
  merchantRef.value = refId;
}
const pgFlowCheckBox = document.getElementById("use-pg-flow-checkbox");
const pgInfoSection = document.getElementById("pg-info");

if (pgFlowCheckBox) {
  pgFlowCheckBox.addEventListener("change", (e) => {
    const checked = pgFlowCheckBox.checked;
    pgInfoSection.style.display = checked ? "block" : "none";
  });
}

const transactionForm = document.getElementById("merchant-transaction-form");
if (transactionForm) {
  transactionForm.addEventListener("submit", (e) => {
    submitMerchantTransaction(e, this);
  });
}

function submitMerchantTransaction(e, form) {
  e.preventDefault();
  const merchantRefId = document.getElementById("merchant_reference_id").value;
  const isPGFlow = pgFlowCheckBox.checked;

  const pgName = document.getElementById('pg_name').value
  const pgKey = document.getElementById('pg_key').value

  const amount = 250;
  const currency = "USD";
  const url = "/api/embedded/checkout";
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  const pgParam = pgKey ? {
    name: pgName,
    publishable_key: pgKey
  } : {
    name: pgName
  }
  const params = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      merchant_reference_id: merchantRefId,
      amount,
      currency,
      tax: 10,
      items: [
        {
          id: "HOUSE-DANNY-1",
          price: 120,
          unit: "night",
          quantity: 2,
          from: "Tues, Oct 2, 2022",
          to: "Friday, Oct 5, 2022",
        },
      ],
      pg_token_provider_config: !isPGFlow ? undefined : pgParam 
    }),
  };
  fetch(url, params)
    .then((response) => {
      return response.json();
    })
    .then((value) => {
      if (value.redirect_url) {
        window.location.href = value.redirect_url;
      }
    });
}

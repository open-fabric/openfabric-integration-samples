window.onload = onLoad; // Runs the function on click

let loaderTemplate = `
<div id="waiting-loader">
<div id="loader"></div>
<div id="loader_message">Loading ... </div>
</div>
`;
let pgTemplate = `
`
function onLoad() {
  const loader = createElementFromHTML(loaderTemplate);
  document.body.insertAdjacentElement("afterbegin", loader);
  const queryString = new URLSearchParams(window.location.search);
  const merchant_reference_id = queryString.get("merchant_reference_id");
  if (!merchant_reference_id) {
    handleMissingRefId();
    return;
  }
  transactionByMerchantRefId(merchant_reference_id).then((trans) => {
    document.body.style.background = "#34495e";
    loader.remove();
    displayDetail(trans);
    handlePaymentInfo(trans);
  });
}

function handlePaymentInfo(trans) {
  if (trans.status === "Approved" && trans.ofTransaction) {
    const card_fetch_token = trans.ofTransaction.card_fetch_token;
    card_fetch_token && displayCardInfo(trans);
    const pg_card_token = trans.ofTransaction.pg_card_token
    pg_card_token && displayPGToken(pg_card_token)
  }
}

function displayPGToken(pg_card_token) {
  const pgElement =  document.getElementById('pg-token-infomation')
  const pgValue = document.getElementById('pg-token-value')
  pgValue.innerText = pg_card_token
  pgElement.style.display = 'inherit'
}
async function displayCardInfo(trans) {
  const loader = createElementFromHTML(loaderTemplate);

  const paymentInfoElement = document.getElementById("payment-info");
  paymentInfoElement.insertAdjacentElement("afterbegin", loader);
  updateLoaderMessage("Fetch Card Info ...");
  const cardInfo = await fetchCardByRefId(trans.merchant_reference_id);
  const card_number = cardInfo.card_number
  const sections = card_number.match(/.{1,4}/g);
  const section1 = document.getElementById("section1");
  section1.innerText = sections[0]
  
  const section2 = document.getElementById("section2");
  section2.innerText = sections[1]

  const section3 = document.getElementById("section3");
  section3.innerText = sections[2]

  const section4 = document.getElementById("section4");
  section4.innerText = sections[3]

  const expEl =  document.getElementById("exp-date");
  expEl.innerText = `${cardInfo.expiry_month}/${cardInfo.expiry_year}`

  const cvvEl = document.getElementById('cvv-number')
  cvvEl.innerText = cardInfo.cvv
  const cardInfoElement = document.getElementById("card-infomation");
  cardInfoElement.style.display = "inherit";
  loader.remove();
}

function displayDetail(trans) {
  const transDetailElement = document.getElementById("transaction-detail");
  transDetailElement.style.display = "inherit";
  const status = document.getElementById("transaction-status");
  status.innerText = trans.status;
}

function updateLoaderMessage(message) {
  const loader_message = document.getElementById("loader_message");
  loader_message.innerText = message;
}

function handleMissingRefId() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
  updateLoaderMessage("Missing merchant_reference_id");
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}

function fetchCardByRefId(merchant_reference_id) {
  const url = "/api/embedded/transaction/fetch-card";
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "manual",
    body: JSON.stringify({
      merchant_reference_id,
    }),
  };
  return fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => JSON.parse(result))
    .catch((error) => console.log("error", error));
}

function transactionByMerchantRefId(merchant_reference_id) {
  const url = `/api/embedded/transaction/${merchant_reference_id}`;
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "manual",
  };
  return fetch(url, requestOptions)
    .then((response) => response.text())
    .then((result) => JSON.parse(result))
    .catch((error) => console.log("error", error));
}

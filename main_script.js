document.getElementById("email").addEventListener("blur", function (event) {
  var emailInput = document.getElementById("email");
  var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (emailInput.value && !emailPattern.test(emailInput.value)) {
    emailInput.style.borderColor = "red";
    event.preventDefault();
  } else {
    emailInput.style.borderColor = "rgba(0, 0, 0, 0)";
  }
});

function counterAnimation() {
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    counter.innerText = "0";

    const updateCounter = () => {
      const target = +counter.getAttribute("data-target");

      let firstValue = "";

      if (counter.id === "percentage") {
        firstValue = counter.innerText
          .substring(0, counter.innerText.length - 1)
          .replace(/,/g, "");
      } else {
        firstValue = counter.innerText.substring(1).replace(/,/g, "");
      }

      const c = +firstValue;

      const increment = (target / 200).toFixed(2);

      let inner__value = "";

      if (c < target) {
        const temp = `${Math.ceil(c + Number(increment))}`;
        inner__value = temp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setTimeout(updateCounter, 10);
      } else {
        const tempTarget = Math.ceil(target);
        inner__value = tempTarget
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      if (counter.id === "percentage") {
        counter.innerText = inner__value + "%";
      } else {
        counter.innerText = "$" + inner__value;
      }
    };

    updateCounter();
  });
}

function calculation() {
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const grossCommission = Number(
    document.getElementById("gross-commission").value
  );
  const brokerTake = Number(document.getElementById("broker-take").value);
  const franchiseFee = Number(document.getElementById("franchise-fee").value);
  const officeDesk = Number(document.getElementById("office-desk").value);
  const transaction = Number(document.getElementById("transaction").value);

  const formData = {
    firstname: firstName,
    lastname: lastName,
    email: email,
    "gross-commission": grossCommission,
    "broker-take": brokerTake,
    "franchise-fee": franchiseFee,
    "office-desk": officeDesk,
    transaction: transaction,
  };

  let isValid = true;

  Object.keys(formData).forEach((key) => {
    if (!formData[key]) {
      document.getElementById(key).style.borderColor = "#ff1a1a";
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  const step1 = grossCommission * (1 - (franchiseFee + brokerTake) / 100);

  const step2 = step1 - officeDesk;
  const step3 = grossCommission - (400 - transaction) - 897;

  document.getElementById("currentFirm").setAttribute("data-target", step1);
  document.getElementById("ourFirm").setAttribute("data-target", step3);
  document
    .getElementById("extraResult")
    .setAttribute("data-target", step3 - step1);
  document
    .getElementById("percentage")
    .setAttribute("data-target", ((step3 - step1) / step3) * 100);

  counterAnimation();

  document.getElementById("results").style.display = "flex";

  setTimeout(() => {
    submitData();
  }, 2500);
}

function submitData() {
  const data = {
    created_date: new Date(Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    firstname: document.getElementById("firstname").value,
    lastname: document.getElementById("lastname").value,
    email: document.getElementById("email").value,
    gross_commission: document.getElementById("gross-commission").value,
    broker_keeps: document.getElementById("broker-take").value,
    franchis_fee: document.getElementById("franchise-fee").value,
    other_annual_fee: document.getElementById("office-desk").value,
    sales_transaction: document.getElementById("transaction").value,
    current_firm: document.getElementById("currentFirm").innerHTML,
    kale_take: document.getElementById("ourFirm").innerText,
    amount: document.getElementById("extraResult").innerText,
    percentage: document.getElementById("percentage").innerText,
  };

  fetch(
    "https://script.google.com/macros/s/AKfycbz8FRXfMtF2TwF4YFg-Y8vVHwyVxnqwz9DF7mTyGVLaLfQnM-bp5qcEaqjkHcss2YOz/exec",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: "no-cors",
    }
  )
    .then((response) => console.log("response >>>", response))
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
}

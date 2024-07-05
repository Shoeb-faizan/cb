const mainContainer = document.getElementById('pricingContainer');

// Managing pricing conditions for UI
let installment, installmentSale, scholarshipOffer;

// PaymentData.userSelectedScholarship is the selected or not selected scholarship
const totalFinancialAid = 531;
const locationObj = {};
const numOfInstallments = numberOfInstallment;
let CouponCode = courseCode + "-Scholarship";
const perk = promoPerks;
const customMessage = promoMsg;
let phoneChargebee = 0;
let wa_updates_chargebee = '';
let subscribe = '';
let donate = '';

const actualState = {
    installmentSale: '',    // PayInInstallment offer price true or false
    installment: '',
    scholarshipOffer: ''    // ScholarshipOffer
};

const currencySymbols = {
    "gbp": "£",
    "eur": "€",
    "usd": "$",
};

const ansarPayment = {
    "gbp": {
        "regular": gbp_ansar_reg,
        "sale": gbp_ansar_sale
    },
    "eur": {
        "regular": eur_ansar_reg,
        "sale": eur_ansar_sale
    },
    "usd": {
        "regular": usd_ansar_reg,
        "sale": usd_ansar_sale
    }
};

const onetimePayment = {
    "gbp": {
        "regular": gbp_full_reg,
        "sale": gbp_full_sale
    },
    "eur": {
        "regular": eur_full_reg,
        "sale": eur_full_sale
    },
    "usd": {
        "regular": usd_full_reg,
        "sale": usd_full_sale
    }
};

const payInInstallments = {
    "gbp": {
        "regular": gbp_in_reg,
        "sale": gbp_in_sale
    },
    "eur": {
        "regular": eur_in_reg,
        "sale": eur_in_sale
    },
    "usd": {
        "regular": usd_in_reg,
        "sale": usd_in_sale
    }
};

const paymentData = {
    type: '',
    curr: '',
    donate: 'none',
    userSelectedScholarship: providingScholarship
    // By default scholarship is applied meaning 'Y' meaning apply coupon code
};

const userData = {
    firstname: '',
    lastname: '',
    email: '',
    phone: 0,
    gender: '',
    updates: null,
    subscribe: null,
    paymentMethod: paymentData.type,
    scholarship: 'Y'
};

const clearPricingContainer = () => mainContainer.innerHTML = "";

const payInstallments = () => {
    // alert('Pay in installments selected');
    // Need to add Currency Dynamically
    let cbInstance = Chargebee.getInstance();
    let cart = cbInstance.getCart();
    // alert(courseCode.toUpperCase()+"-"+paymentData.type+"-"+paymentData.curr.toUpperCase());
    // alert(wa_updates_chargebee);
    let product;
    if (paymentData.type === 'full') {
        paymentData.type = 'PayinFull';
        product = cbInstance.initializeProduct(courseCode.toUpperCase() + "-" + paymentData.type + "-" + paymentData.curr.toUpperCase());
    } else if (paymentData.type === 'ansar') {
        paymentData.type = 'PayAnsar';
        product = cbInstance.initializeProduct(courseCode.toUpperCase() + "-" + paymentData.type + "-" + paymentData.curr.toUpperCase());
    } else {
        product = cbInstance.initializeProduct(courseCode.toUpperCase() + "-" + paymentData.type + "-" + paymentData.curr.toUpperCase());
    }
    cart.replaceProduct(product);

    if (paymentData.donate !== "none") {
        product.addAddon(paymentData.donate);
        cart.replaceProduct(product);
    }

    let customer = {
        first_name: userData.firstname,
        last_name: userData.lastname,
        email: userData.email,
        phone: phoneChargebee,
        billing_address: {
            first_name: userData.firstname[0].toUpperCase() + userData.firstname.substring(1),
            last_name: userData.lastname[0].toUpperCase() + userData.lastname.substring(1),
            email: userData.email.toLowerCase(),
            country: locationObj.location.country.toUpperCase(),
            phone: phoneChargebee,
            zip: locationObj.location.postal,
            city: locationObj.location.city
        }
    };
    // Setting custom fields
    let gender_cb = userData.gender.substring(0, 1).toUpperCase() + userData.gender.substring(1);
    // alert(gender_cb);
    customer["cf_gender"] = gender_cb;
    customer["cf_whatsapp_permission"] = wa_updates_chargebee;

    cart.setCustomer(customer);
    cart.proceedToCheckout();
};

const getLocation = (ip) => {
    locationObj.location = ip;
    console.log(locationObj.location);
    // console.log(locationObj.location.country);
};

const showErr = (value) => {
    let err = document.getElementById('error');
    err.textContent = `Please ${value}`;
};

const handleSubmit = (e) => {
    const userForm = document.getElementById('userDetails');
    const domElements = {
        firstname: document.getElementById('firstname'),
        lastname: document.getElementById('lastname'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone')
    };

    userData.firstname = userForm.elements['firstname'].value;
    userData.lastname = userForm.elements['lastname'].value;
    userData.email = userForm.elements['email'].value;
    userData.phone = userForm.elements['phone'].value;
    userData.gender = userForm.elements['gender'].value;
    userData.updates = userForm.elements['updates'].checked;
    userData.subscribe = userForm.elements['subscribeCheck'].checked;

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    e.preventDefault();

    if (userData.firstname) {
        domElements.firstname.style.borderColor = '#e7e7e7';

        if (userData.lastname) {
            domElements.lastname.style.borderColor = '#e7e7e7';

            if (reg.test(userData.email)) {
                domElements.email.style.borderColor = '#e7e7e7';

                if ((userData.phone.length > 6 || userData.phone.length < 13) && userData.phone) {
                    phoneChargebee = userData.phone;
                    userData.phone = window.iti.getNumber();
                    domElements.phone.style.borderColor = '#e7e7e7';

                    if (userData.gender) {
                        wa_updates_chargebee = userData.updates;
                        userData.updates ? userData.updates = 'Y' : userData.updates = 'N';
                        userData.subscribe ? userData.subscribe = 'Y' : userData.subscribe = 'N';
                        paymentData.donate !== 'none' ? donate = paymentData.donate : donate = "none";

                        if (paymentData.type === "full" || paymentData.type === "Installment" || paymentData.type === "ansar") {
                            postDataToWebhook(userData);
                            payInstallments();
                        }
                    } else {
                        showErr('select your Gender. We need this information to create gender-specific groups in myAlBalagh');
                    }
                } else {
                    showErr('Enter a valid Phone Number');
                }
            } else {
                showErr('Enter a valid Email Address');
                domElements.email.style.borderColor = 'red';
            }
        } else {
            showErr('enter a valid Last Name');
            domElements.lastname.style.borderColor = 'red';
        }
    } else {
        showErr('Enter a valid First Name');
        domElements.firstname.style.borderColor = 'red';
    }
};

const cleanCurrencies = () => {
    document.getElementById('payFullPrice').innerHTML = "";
    payInInstallments.gbp.regular && payInInstallments.usd.regular && payInInstallments.eur.regular ? document.getElementById('payEmi').innerHTML = "" : null;
};

const secondFormEventListeners = () => {
    document.getElementById('userDetails').addEventListener('submit', handleSubmit);

    document.querySelectorAll('input[name="gender"]').forEach(e => e.addEventListener('change', function () {
        userData.gender = this.value;
    }));
};

const backLink = (e) => {
    e.preventDefault();
    clearPricingContainer(); // Clean pricingContainer
    const dataArr = JSON.parse(localStorage.getItem('userCurrData')); // Fetch data from browser
    const type = dataArr[0]['type'];
    defaultForm(dataArr[0]['curr']);
    if (type === 'Installment') {
        document.getElementById('full').checked = false;
        document.getElementById(type).checked = true;
        document.getElementById('payFull').classList.toggle('green');
        const installmentContainer = document.getElementById('payininstallments');
        if (installmentContainer) {
            installmentContainer.classList.toggle('green');
        }
    }
    if (dataArr[0]['userSelectedScholarship'] === 'N') {
        const scholarship = document.getElementById('scholarshipNotRequired');
        if (scholarship) {
            scholarship.checked = true;
            // If this is checked
            const salePrice = document.querySelectorAll('.salePrice');
            const regularPrice = document.querySelectorAll('.regularPrice');
            salePrice.forEach(e => e.classList.add('hide'));
            regularPrice.forEach(e => e.classList.add('undoScholarship'));
        }
    }
    if (dataArr[0]['donate'] !== 'none') {
        document.getElementById('donate-5').checked = true;
        document.getElementById('donate-box').classList.toggle('green');
    }
    if (providingScholarship === 'Y') {
        canPayFull(paymentData.curr, paymentData.type);
    }
};

const userDetailsForm = () => {
    let html = `<form class="userDetails" id="userDetails">
        <h3 title="checkout" class="checkoutFormHeading">Learner Details</h3>
        <p id="error"></p>
        <input type="text" name="FirstName" id="firstname" placeholder="First Name">
        <input type="text" name="LastName" id="lastname" placeholder="Last Name">
        <input type="email" name="Email" id="email" placeholder="abc@xyz.com">
        <input id="phone" type="tel" name="phone"/>
        <div class="genderRadioBtns">
            <label for="male"><input type="radio" name="gender" value="male" id="male">Male</label>
            <label for="female"><input type="radio" name="gender" value="female" id="female">Female</label>
        </div>
        <p class="refundPolicy"><input type="checkbox" name="refundPolicy" id="refundPolicy" required/><label for="refundPolicy">. Agree to the <a href="https://www.albalaghacademy.org/al-balagh-refund-policy-short-term/" target="_blank"><u><strong>Terms, Conditions and Refund Policy</strong></u></a>. (Required)</label></p>
        <p class="whatsappUpdates"><input type="checkbox" name="updates" id="updates"/><label for="updates">Send course enrolments updates on WhatsApp. (Optional)</label></p>
        <p class="subscribeCheck"><input type="checkbox" name="subscribeCheck" id="subscribeCheck"/><label for="subscribeCheck">Subscribe to Al Balagh Academy Newsletter. (Optional)</label></p>
        <button type="submit" class="proceedToPayment" id="proceedToPay">Proceed to Secure Payment</button>
        <p class="backLink"><a href="/" id="backLink">&#8810; Change ${installment ? 'Payment Plan or Currency' : 'Currency'}</a></p>
    </form>`;

    mainContainer.insertAdjacentHTML('beforeend', html);

    function getIp(callback) {
        fetch('https://ipinfo.io/json?token=2c57573ba0ff15', { headers: { 'Accept': 'application/json' } })
            .then((resp) => resp.json())
            .catch(() => {
                return { country: 'gb' };
            })
            .then((resp) => {
                getLocation(resp);
                callback(resp.country);
            });
    }

    document.getElementById('backLink').addEventListener('click', backLink);

    const input = document.getElementById("phone");
    let iti = window.intlTelInput(input, {
        preferredCountries: ["gb", "us", "ps", "au", "in"],
        initialCountry: "auto",
        geoIpLookup: getIp,
        separateDialCode: true,
    });

    window.iti = iti;
    secondFormEventListeners();
};

const setupEventListeners = () => {
    const checkoutForm = (e) => {
        e.preventDefault();
        let checkedBtn = 0;
        const checkPaymentType = document.querySelectorAll('input[name="paymentMethod"]');

        for (let i = 0; i < checkPaymentType.length; i++) {
            checkPaymentType[i].checked ? checkedBtn++ : checkedBtn;
        }

        if (checkedBtn < 1) {
            alert('please select a payment method');
        } else {
            let dataArr = [];
            paymentData.type === "" ? paymentData.type = 'full' : paymentData.type;
            dataArr.push(paymentData);
            localStorage.setItem('userCurrData', JSON.stringify(dataArr));
            clearPricingContainer();
            userDetailsForm();
        }
    };

    document.getElementById('checkoutForm').addEventListener('submit', checkoutForm);

    const scholarshipCheckbox = document.getElementById('scholarshipNotRequired');

    document.querySelectorAll('input[name="currency"]').forEach(e => e.addEventListener('change', function () {
        cleanCurrencies();
        if (scholarshipCheckbox) {
            if (scholarshipCheckbox.checked && paymentData.userSelectedScholarship === 'N') {
                if (installmentSale && scholarshipOffer) {
                    installmentSale = false;
                    scholarshipOffer = false;
                }
            }
        }
        getFullPrice(this.value);
        getEmi(this.value);
        paymentData.curr = this.value;
        canPayFull(this.value, paymentData.type);
        enableDonateOption(this.value);
        if (paymentData.donate !== 'none') {
            const donateVal = document.getElementById('donate-5');
            donateVal.checked = true;
            paymentData.donate = donateVal.value;
            document.getElementById('donate-box').classList.add('green');
        }
    }));

    const checkPaymentType = document.querySelectorAll('input[name="paymentMethod"]');
    checkPaymentType.forEach((e) => e.addEventListener('change', function (event) {
        event.preventDefault();
        for (let i = 0; i < checkPaymentType.length; i++) {
            if (checkPaymentType[i] !== this) {
                checkPaymentType[i].checked = false;
                paymentData.type = this.id; // Store the payment method
                canPayFull(paymentData.curr, this.id);
                if (this.id === 'full') {
                    document.getElementById('payFull').classList.add('green');
                    document.getElementById('payininstallments').classList.remove('green');
                } else if (this.id === 'ansar') {
                    document.getElementById('payAnsar').classList.add('green');
                    document.getElementById('payFull').classList.remove('green');
                } else {
                    document.getElementById('payininstallments').classList.add('green');
                    document.getElementById('payFull').classList.remove('green');
                }
            }
        }
    }));
};

const additionals = () => {
    if (customMessage && customMessage !== "") {
        let customP = `<p>${customMessage}</p>`;
        const scholarshipMsg = document.getElementById('customMessage');
        if (scholarshipMsg) {
            scholarshipMsg.insertAdjacentHTML('beforeend', customP);
        }
    }
    if (perk && perk !== "") {
        let customP = `<p>${perk}</p>`;
        document.getElementById('perk').insertAdjacentHTML('beforeend', customP);
    }
};

const uncheckAllCheckboxes = (arr, ele) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== ele) {
            arr[i].checked = false;
            if (arr[i].parentNode.classList.contains('green')) {
                arr[i].parentNode.classList.remove('green');
            }
        }
    }
};

const enableDonateOption = (curr = 'gbp') => {
    const donateLabelsContainer = document.getElementById('donate_options');
    donateLabelsContainer.innerHTML = "";

    let html = `
        <label for="donate-5" class="donate_label">
            <div class="donate-box" id="donate-box">
                <input type="checkbox" id="donate-5" name="donate" value="donate-${curr}-5"/> Donate ${currencySymbols[curr]}5 to Al Balagh Scholarship Fund to help us support passionate seekers of Islamic knowledge who would not be able to afford otherwise
            </div>
        </label>
    `;

    donateLabelsContainer.insertAdjacentHTML('beforeend', html);
    const donateBox = document.getElementById('donate-box');

    document.getElementById('donate-5').addEventListener('click', function () {
        if (this.checked) {
            paymentData.donate = this.value;
            donateBox.classList.toggle('green');
        } else {
            paymentData.donate = 'none';
            donateBox.classList.toggle('green');
        }
    });
};

const canPayFull = (curr = 'gbp', type) => {
    const priceContainer = document.getElementById('disableScholarship');
    if (priceContainer) {
        priceContainer.innerHTML = "";

        type === 'Installment' ? type = payInInstallments[curr].regular : type = onetimePayment[curr].regular;

        let html = `<label for="scholarshipNotRequired"><input type="checkbox" name="scholarshipNotRequired" id="scholarshipNotRequired" for="scholarshipNotRequired" ${paymentData.userSelectedScholarship === 'N' ? 'checked' : ""}/> I can afford to pay the full fee of <span id="fullPay">${currencySymbols[curr]}${type}</span> and support Al Balagh’s noble mission</label>`;

        priceContainer.insertAdjacentHTML('beforeend', html);

        const scholarshipCheckbox = document.getElementById('scholarshipNotRequired');

        const removeClass = (arr, classStr) => {
            arr.forEach((e, i) => {
                if (actualState.installmentSale) {
                    arr[1].classList.remove(classStr);
                }
                arr[0].classList.remove(classStr);
            });
        };

        if (scholarshipCheckbox) {
            scholarshipCheckbox.addEventListener('click', function () {
                const salePrice = document.querySelectorAll('.salePrice');
                const regularPrice = document.querySelectorAll('.regularPrice');
                if (this.checked) {
                    paymentData.userSelectedScholarship = 'N';
                    installmentSale = false;
                    scholarshipOffer = false;
                    salePrice.forEach(e => e.classList.add('hide'));
                    regularPrice.forEach(e => e.classList.add('undoScholarship'));
                    userData.scholarship = 'N';
                } else if (this.checked === false) {
                    paymentData.userSelectedScholarship = 'Y';
                    installmentSale = actualState.installmentSale;
                    scholarshipOffer = actualState.scholarshipOffer;
                    removeClass(salePrice, 'hide');
                    removeClass(regularPrice, 'undoScholarship');
                }

                if (installmentSale) {
                    installmentSale = actualState.installmentSale;
                }
            });
        }
    }
};

// Step 3: Inserting HTML through DOM Manipulation for PRICES
const getEmi = (curr) => {
    const installmentPriceContainer = document.getElementById('payEmi');
    var html = `<a class="${installmentSale ? 'regularPrice' : 'regularPrice undoScholarship'}">${currencySymbols[curr]}<span>${payInInstallments[curr].regular}</span></a>
        <a class="${installmentSale ? 'salePrice' : 'salePrice hide'}">${currencySymbols[curr]}<span>${payInInstallments[curr].sale}</span></a>
        <div class="emi_icon">
            <img src="https://checkout2-0.pages.dev/PayPal_and_Cards.png" alt="payment methods"/>
        </div>
        <p class="numOfInstallments">Pay in <span>${numOfInstallments}</span> installments</p>`;

    installmentPriceContainer ? installmentPriceContainer.insertAdjacentHTML('beforeend', html) : null;
};

// Step 3: Inserting HTML through DOM Manipulation for PRICES
const getFullPrice = (curr) => {
    var html = `<a class="${scholarshipOffer ? 'regularPrice' : 'regularPrice undoScholarship'}">${currencySymbols[curr]}<span>${onetimePayment[curr].regular}</span></a>
        <a class="${scholarshipOffer ? 'salePrice' : 'salePrice hide'}">${currencySymbols[curr]}<span>${onetimePayment[curr].sale}</span></a>
        <div class="full_icon">
            <img src="https://checkout2-0.pages.dev/PayPal_and_Cards.png" alt="payment methods"/>
        </div>`;

    document.getElementById('payFullPrice').insertAdjacentHTML('beforeend', html);

    var ansarHtml = `<a class="${scholarshipOffer ? 'regularPrice' : 'regularPrice undoScholarship'}">${currencySymbols[curr]}<span>${ansarPayment[curr].regular}</span></a>
        <a class="${scholarshipOffer ? 'salePrice' : 'salePrice hide'}">${currencySymbols[curr]}<span>${ansarPayment[curr].sale}</span></a>
        <div class="ansar_icon">
            <img src="https://checkout2-0.pages.dev/PayPal_and_Cards.png" alt="payment methods"/>
        </div>`;

    document.getElementById('payAnsarPrice').insertAdjacentHTML('beforeend', ansarHtml);
};

const defaultForm = (curr = 'gbp') => {
    installment = payInInstallments.gbp.regular && payInInstallments.usd.regular && payInInstallments.eur.regular ? true : false;

    if (providingScholarship === 'Y') {
        scholarshipOffer = true;
        actualState.scholarshipOffer = scholarshipOffer;

        if (installment) {
            installmentSale = payInInstallments.gbp.sale && payInInstallments.usd.sale && payInInstallments.eur.sale ? true : false;
            actualState.installmentSale = installmentSale;
        }
    } else if (providingScholarship === 'N') {
        scholarshipOffer = false;
        actualState.scholarshipOffer = scholarshipOffer;

        if (installment) {
            installmentSale = false;
            actualState.installmentSale = installmentSale;
        }
    }

    let html = `<form class="checkoutForm" id="checkoutForm">
        <h4 class="currencyType">Select Currency:</h4>
        <div class="radioButtons">
            <label for="gbp"><input type="radio" name="currency" value="gbp" id="gbp">GBP (&#163;)</label>
            <label for="usd"><input type="radio" name="currency" value="usd" id="usd">USD (&#36;)</label>
            <label for="eur"><input type="radio" name="currency" value="eur" id="eur">EUR (&euro;)</label>
        </div>
        <div class="paymentType" id="paymentType">
            ${scholarshipOffer ? `<div id="customMessage"></div>` : ''}
            <label for="full">
                <div class="payFull green" id="payFull">
                    <input type="checkbox" name="paymentMethod" value="full" id="full" checked><label for="full">Pay in Full</label>
                    <div class="priceBox clearfix" id="payFullPrice"></div>
                </div>
            </label>
            ${installment ? `<label for="Installment">
                <div class="payininstallments" id="payininstallments">
                    <input type="checkbox" name="paymentMethod" value="Installment" id="Installment"><label for="Installment">Pay in Installments</label>
                    <div class="priceBox clearfix" id="payEmi"></div>
                </div>
            </label>` : ""}
            <label for="ansar">
                <div class="payAnsar" id="payAnsar">
                    <input type="checkbox" name="paymentMethod" value="ansar" id="ansar"><label for="ansar">Pay AL-Ansar Payment</label>
                    <div class="priceBox clearfix" id="payAnsarPrice"></div>
                </div>
            </label>
            <div id="perk"></div>
            <div id="donate_options"></div>
        </div>
        <button type="submit" class="btn-proceed">Proceed</button>
    </form>`;

    mainContainer.insertAdjacentHTML('beforeend', html);

    document.querySelectorAll('input[name="currency"]').forEach(e => e.id === curr ? e.checked = true : e.checked = false);

    enableDonateOption(curr);
    paymentData.curr = curr;
    getFullPrice(curr);

    if (installment) {
        getEmi(curr);
    }

    if (scholarshipOffer) {
        canPayFull();
    }

    additionals();
    setupEventListeners();
};

const init = () => {
    defaultForm();
};
init();

function postDataToWebhook() {
    console.log("I am Inside Webhook Function");

    var webHookUrl = "https://hook.integromat.com/9hofuz4v3atww2a738qtnvg1j2uyklqu";

    var oReq = new XMLHttpRequest();
    var myJSONStr = payload = {
        "First Name": userData.firstname[0].toUpperCase() + userData.firstname.substring(1),
        "Last Name": userData.lastname[0].toUpperCase() + userData.lastname.substring(1),
        "Email ID": userData.email.toLowerCase(),
        "Mobile Number": userData.phone,
        "payment Method": paymentData.type,
        "whatsAppPermission": userData.updates,
        "Gender": userData.gender,
        "Course Code": courseCode.toLowerCase(),
        "Country": locationObj.location.country.toUpperCase(),
        "City": locationObj.location.city,
        "State": locationObj.location.region,
        "Time Zone": locationObj.location.timezone,
        "WhatsApp Permission": userData.updates,
        "Selected Currency": paymentData.curr.toUpperCase(),
        "Subscription": userData.subscribe,
        "donation": paymentData.donate
    };

    oReq.addEventListener("load", reqListener);
    oReq.open("POST", webHookUrl, true);
    oReq.setRequestHeader('Content-Type', 'application/json');
    oReq.send(JSON.stringify(myJSONStr));
}

function reqListener() {
    console.log(this.responseText);
}
</script>

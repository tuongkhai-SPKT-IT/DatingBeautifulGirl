const ID = "ID"
const TimeStart = "TimeStart"
const AcceptDate = "AcceptDate"
const Where = "Where"
const When = "When"
const WhatEat = "WhatEat"
const WhatDrink = "WhatDrink"
const TimeEnd = "TimeEnd"
const scriptURL = 'https://script.google.com/macros/s/AKfycbyZ-OltR-cC213b2XhUQNSWlf4Fk-MFX4CXkOOM7c6YuaXu54GIPqql1Ae8EnxSSkd_NA/exec'

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
function formatDay(dateString) {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        console.log("Định dạng ngày không hợp lệ"); // Xử lý nếu chuỗi không hợp lệ
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function formatTime(timeString) {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);

    if (period.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
    } else if (period.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function removeBracketsAndQuotes(str) {
    return str.replace(/[\[\]"]/g, '');
}
function addBlank(str) {
    return str.replace(/[,]/g, ', ');
}

//Manage Data from API
const getData = () => {
    fetch(scriptURL).then(response => {
        console.log(typeof response)
        response.json().then((res) => {
            console.log(res)
            localStorage.setItem(ID, res[0] === "ID" ? 1 : res[0] + 1)
        });
        const now = new Date();

        window.localStorage.setItem(TimeStart, formatDate(now))
    })
}
const postData = () => {
    const formData = new FormData();
    ///data post
    const now = new Date();
    formData.append(ID, window.localStorage.getItem(ID))
    formData.append(TimeStart, window.localStorage.getItem(TimeStart))
    formData.append(AcceptDate, formatDay(now))
    if (window.localStorage.getItem(Where) && window.localStorage.getItem(When) && window.localStorage.getItem(WhatEat) && window.localStorage.getItem(WhatDrink)) {

        formData.append(Where, removeBracketsAndQuotes(addBlank(window.localStorage.getItem(Where))))
        formData.append(When, removeBracketsAndQuotes(addBlank(window.localStorage.getItem(When))))
        formData.append(WhatEat, removeBracketsAndQuotes(addBlank(window.localStorage.getItem(WhatEat))))
        formData.append(WhatDrink, removeBracketsAndQuotes(addBlank(window.localStorage.getItem(WhatDrink))))
    }
    else return;


    formData.append(TimeEnd, formatDate(now))

    //post data
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            console.log(response);
            drinksCard.style.display = 'none';
            // Show completion card
            completionCard.style.display = 'block';
            completionCard.classList.add('show');
            // Scroll to top
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            // Create completion celebration effects
            createCompletionCelebration();
        })
        .then(() => {
            setTimeout(() => {
                console.log("đã ghi");
            }, 1000); window.location.reload();
        })
        .catch(error => console.error('Error!', error.message))
}
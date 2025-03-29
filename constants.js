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
        response.json().then((res) => {
            localStorage.setItem(ID, res[0] === "ID" ? 1 : res[0] + 1)
        });
        const now = new Date();

        localStorage.setItem(TimeStart, formatDate(now))
    })
}
const postData = () => {
    const formData = new FormData();
    ///data post
    const now = new Date();
    formData.append(ID, localStorage.getItem(ID))
    formData.append(TimeStart, localStorage.getItem(TimeStart))
    formData.append(AcceptDate, formatDay(now))
    if (localStorage.getItem(Where) && localStorage.getItem(When)
        && localStorage.getItem(WhatEat) && localStorage.getItem(WhatDrink)) {

        formData.append(Where, removeBracketsAndQuotes(addBlank(localStorage.getItem(Where))))
        formData.append(When, removeBracketsAndQuotes(addBlank(localStorage.getItem(When))))
        formData.append(WhatEat, removeBracketsAndQuotes(addBlank(localStorage.getItem(WhatEat))))
        formData.append(WhatDrink, removeBracketsAndQuotes(addBlank(localStorage.getItem(WhatDrink))))
    }
    else return;


    formData.append(TimeEnd, formatDate(now))
    console.log("checkout from PostData")
    //post data
    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            setTimeout(() => {
                drinksCard.style.display = 'none';

                // Show completion card
                completionCard.style.display = 'block';

                setTimeout(() => {
                    completionCard.classList.add('show');

                    // Scroll to top
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

                    // Create completion celebration effects
                    createCompletionCelebration();
                }, 50);
            }, 500);

        })
        .then(() => {
            setTimeout(() => {
                console.log("đã ghi");
            }, 1000);
        })
        .catch(error => console.error('Error!', error.message))
}
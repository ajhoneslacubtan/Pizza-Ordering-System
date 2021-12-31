// Code adapted from Coding Snow
function updateClock(){
    var now = new Date();
    var dname = now.getDay(),
        month = now.getMonth(),
        dnum = now.getDate(),
        year = now.getFullYear(),
        hour = now.getHours(),
        minute = now.getMinutes(),
        period = 'AM';
    
    if(hour == 0){
        hour = 12;
    }
    if(hour > 12){
        hour = hour - 12;
        period = "PM";
    }

    Number.prototype.pad = function(digits){
        for(var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
    }
    
    var months_arr = ["January","February","March","April","May",
                      "June","July","August","September","October",
                      "November","December"];
    var days_arr = ["Sunday","Monday","Tuesday","Wednesday","Thursday",
                    "Friday","Saturday"];
    var ids = ["hour", "minutes", "period", "dayname", "daynum",
               "month", "year"];
    var values = [hour.pad(2), minute.pad(2), period,days_arr[dname],
                  dnum.pad(2), months_arr[month], year];
    for (var i=0; i < ids.length; i++){
        document.getElementById(ids[i]).firstChild.nodeValue=values[i];
    }
}

function initClock(){
      updateClock();
      window.setInterval("updateClock()", 1);
}

initClock();

function userToggle(){
    const toggleUser = document.querySelector('.user-settings');
    toggleUser.classList.toggle('active');
}

const list = document.querySelectorAll('.list-nav');
function activeLink(){
    list.forEach((item) =>
    item.classList.remove('active'));
    this.classList.add('active')
}
list.forEach((item) => item.addEventListener('click', activeLink))
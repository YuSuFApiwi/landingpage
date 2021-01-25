(function () {
    "use strict";
    function validEmail(email) {
        var re = /^([\w'-']+(?:\.[\w'-']+)*)@((?:[\w'-']+\.)*\w[\w'-']{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }
    function validateHuman(honeypot) {
        if (honeypot) {  //if hidden form filled up
            console.log("Robot Detected!");
            return true;
        } else {
            console.log("Welcome Human!");
        }
    }
  // get all data in form and return object
    function getFormData(form) {
        var elements = form.elements;

        var fields = Object.keys(elements).filter(function (k) {
            return (elements[k].name !== "honeypot");
        }).map(function (k) {
            if (elements[k].name !== undefined) {
                return elements[k].name;
      // special case for Edge's html collection
            } else if (elements[k].length > 0) {
                return elements[k].item(0).name;
            }
        }).filter(function (item, pos, self) {
            return self.indexOf(item) === pos && item;
        });
        var formData = {};
        fields.forEach(function (name) {
            var element = elements[name];
      // singular form elements just have one value
            formData[name] = element.value;
      // when our element has multiple items, get their values
            if (element.length) {
                var data = [];
                for (var i = 0; i < element.length; i++) {
          var item = element.item(i);
          if (item.checked || item.selected) {
            data.push(item.value);
          }
        }
        formData[name] = data.join(', ');
      }
    });
    // add form-specific values into the data
    formData.formDataNameOrder = JSON.stringify(fields);
    formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
    formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

    console.log(formData);
    return formData;
  }
  function handleFormSubmit(event) {  // handles form submit without any jquery
    event.preventDefault();           // we are submitting via xhr below
    var form = event.target;
    var data = getFormData(form);         // get the values submitted in the form
    /* OPTION: Remove this comment to enable SPAM prevention, see README.md
    if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
      return false;
    }
    */
    if( data.email && !validEmail(data.email) ) {   // if email is not valid show error
      var invalidEmail = form.querySelector(".email-invalid");
      if (invalidEmail) {
        invalidEmail.style.display = "block";
        return false;
      }
    } else {
      disableAllButtons(form);
      var url = form.action;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      // xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function() {
          if(this.status == 200 && this.readyState == 4)
          {
            var formElements = form.querySelector(".form-elements")
            if (formElements) {
              formElements.style.display = "none"; // hide form contact by Apiwi
            }
            var thankYouMessage = form.querySelector(".page-thank");
            if (thankYouMessage) {
              thankYouMessage.style.display = "block";
              setInterval(() => {
                window.location.href = "https://nagracosmetics.youcan.shop/";
              }, 5000);
            }
          }
         
      };
      // url encode form data for sending as post data
      var encoded = Object.keys(data).map(function(k) {
          return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
      }).join('&');
      xhr.send(encoded);
    }
  }
  function loaded() {
    console.log("Contact form submission handler loaded successfully.");
    // bind to the submit event of our form
    var forms = document.querySelectorAll("form.contact-form");
    for (var i = 0; i < forms.length; i++) {
      forms[i].addEventListener("submit", handleFormSubmit, false);
    }
  };
  document.addEventListener("DOMContentLoaded", loaded, false);
  function disableAllButtons(form) {
    var buttons = form.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }
})();
function getTimeRemaining(endtime){
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor( (total/1000) % 60 );
  const minutes = Math.floor( (total/1000/60) % 60 );
  const hours = Math.floor( (total/(1000*60*60)) % 24 );
  return {total,hours,minutes,seconds};
}function randClient()
{var client = ["images/clients/1.png","images/clients/2.png","images/clients/3.jpg","images/clients/3.jpg","images/clients/4.jpg","images/clients/5.jpg","images/clients/6.jpg","images/clients/7.jpg","images/clients/8.jpg","images/clients/9.jpg","images/clients/10.jpg","images/clients/11.jpg","images/clients/12.jpg","images/clients/13.jpg","images/clients/14.jpg","images/clients/15.jpg","images/clients/16.jpg","images/clients/17.jpg"],p=0;
  const rand = setInterval(()=>{
    p=p==17?0:++p;
    document.getElementById("client").setAttribute("src",client[p]);
  },1000);
}randClient();function initializeClock(endtime) {
  const timeinterval = setInterval(() => {
  const t = getTimeRemaining(endtime);
  document.getElementById("hours").innerHTML = t.hours;
  document.getElementById("minutes").innerHTML = t.minutes;
  document.getElementById("seconds").innerHTML = t.seconds;
  if (t.total <= 0) {
    clearInterval(timeinterval);
  }
  },1000);
}initializeClock('01-25-2025');

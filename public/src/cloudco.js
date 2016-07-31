/*eslint-env browser */
function openTravel() {
    window.location = "travel.html";
}

function openTravelPolicies() {
    window.location = "watson.html";
}

function openHealth() {
    console.log('open health');
}

function makeAccount() {
    console.log('makeAccount');
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var messagearea = document.getElementById('messagearea');
    messagearea.innerHTML = '';

    console.log('email:' + email);

    var xhr = new XMLHttpRequest();

    var uri = 'signup';

    xhr.open('POST', encodeURI(uri));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function (response) {

        var reply = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            if (reply.outcome === 'success') {
                window.location = './login'
            } else {
                email = '';
                password = '';
                messagearea.innerHTML = 'Something went wrong - try again';
            }
        } else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(encodeURI('email=' + email + '&password=' + password));
}

function login() {
    console.log('makeAccount');
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    console.log('email:' + email);

    var xhr = new XMLHttpRequest();

    var uri = 'login';

    var messagearea = document.getElementById('messagearea');
    messagearea.innerHTML = '';

    xhr.open('POST', encodeURI(uri));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function (response) {
        if (xhr.status === 200) {

            console.log('response');
            console.log(xhr.responseText);

            var reply = JSON.parse(xhr.responseText);

            console.log(reply);

            if (reply.outcome === 'success') {
                window.location = './profile'
            } else {
                messagearea.innerHTML = 'Something went wrong - try again';
            }


        } else if (xhr.status !== 200) {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send(encodeURI('email=' + email + '&password=' + password));
}


function get(path, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback(JSON.parse(xmlhttp.responseText));
        }
    }
    xmlhttp.open("GET", path, true);
    xmlhttp.send();
}


function createBenefitRow(policy) {
    var row = document.createElement('div');
    row.className = 'benefitrow';
    row.innerHTML = '<div class="benefiticon">' +
        '<img class="benefitimage" src="images/wash/glasses.svg">' +
        '</div>' +
        '<div class="benefitchannel">' +
        '<div class="benefitmarker"></div>' +
        '</div>' +
        '<div class="benefitTitle">' + policy.title + '</div>';
    return row;
}

function createBenefitEntity(type) {

    var benefit = document.createElement('div');
    benefit.className = 'benefit';

    benefit.innerHTML = '<div class="sideline">' + type + '</div>' +
        '<div class="benefitblock">' +
        '<div class="benefitcap">' +
        '<div class="benefiticon"></div>' +
        '<div class="benefitchanneltop"></div>' +
        '<div class="benefitTitle"></div>' +
        '</div>' +
        '<div id="' + type + '" class="benefitrows">' +
        '</div>' +

        '<div class="benefitcap">' +
        '<div class="benefiticon"></div>' +
        '<div class="benefitchannelbottom"></div>' +
        '<div class="benefitTitle"></div>' +
        '</div>' +
        '</div>';

    return benefit;
}


function getBenefits() {

    checkStatus();

    get('./healthBenefits', function (reply) {
        console.log(reply);

        var header = document.getElementById('owner');
        owner.innerHTML = reply.owner;

        var policies = reply.policies;
        var policyAreas = [];
        var policyKeys = [];

        var benefitset = document.getElementById('benefitset');

        policies.forEach(function (policy) {

            if (policyAreas[policy.type]) {
                policyAreas[policy.type].push(policy);
            } else {
                policyAreas[policy.type] = [];
                policyAreas[policy.type].push(policy);
                policyKeys.push(policy.type);

                var benefitEntity = createBenefitEntity(policy.type);
                benefitset.appendChild(benefitEntity);
            }

            var benefitRow = createBenefitRow(policy);
            var anchor = document.getElementById(policy.type);
            anchor.appendChild(benefitRow);
        })

        console.log(policyAreas);
    })
}

function checkStatus() {

    get('./isLoggedIn', function (reply) {

        var login = document.getElementById('login');
        var logout = document.getElementById('logout');

        if (reply.outcome === 'success') {

            if (login) {
                login.style.display = 'none';
            }
            if (login) {
                logout.style.display = 'inherit';
            }
        } else {
            if (logout) {
                logout.style.display = 'none';
            }
            if (login) {
                login.style.display = 'inherit';
            }
        }
    });
}

checkStatus();
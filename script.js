
let sndr_name;
let group_cd;

// =====================================On Load=====================================
window.addEventListener("load", () => {

    save("sender_name");
    save("group_code");

    // sndr_name = document.getElementById("sender_name").value;
    // group_cd = document.getElementById("group_code").value;


    sndr_name = localStorage.getItem("sender_name");
    group_cd = localStorage.getItem("group_code");


    // document.getElementById("sender_ph_on_head").innerHTML = document.getElementById("sender_name").value;
    // document.getElementById("group_code_on_head").innerHTML = document.getElementById("group_code").value;

    document.getElementById("sender_ph_on_head").innerHTML = localStorage.getItem("sender_name");
    document.getElementById("group_code_on_head").innerHTML = localStorage.getItem("group_code");



    setTimeout(() => {
        load();

    }, 1000);



    setTimeout(() => {

        setInterval(() => {
            msg_update();
        }, 1000);

    }, 3000);


    // setInterval(() => {
    //     msg_update();
    // }, 1000);


});





document.querySelectorAll("input").forEach((ele, ind) => {
    document.querySelectorAll("input")[ind].addEventListener("change", () => {

        sndr_name = document.getElementById("sender_name").value;
        group_cd = document.getElementById("group_code").value;

        document.getElementById("sender_ph_on_head").innerHTML = document.getElementById("sender_name").value;
        document.getElementById("group_code_on_head").innerHTML = document.getElementById("group_code").value;

        load();

    })


})


setInterval(() => {
    // sndr_name = document.getElementById("sender_name").value;
    // group_cd = document.getElementById("group_code").value;

    // document.getElementById("sender_ph_on_head").innerHTML = document.getElementById("sender_name").value;
    // document.getElementById("group_code_on_head").innerHTML = document.getElementById("group_code").value;

    btn_disable();


}, 1000);




// ===============================Button Disabled===============================


function btn_disable() {

    if (document.getElementById("sender_name").value.trim() != "" && document.getElementById("group_code").value.trim() != "" && document.getElementById("chat_entry").value.trim() != "") {

        document.getElementById("submit-btn").disabled = false;

    }
    else {
        document.getElementById("submit-btn").disabled = true;

    }

}


// =================================Data Upload=================================

// function message_send() {

// document.getElementById("submit-btn").style.display = "none";
// document.getElementById("wait_mess").style.display = "block";

const scriptURL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdQcjeVqZCTOuyMJ4y9bc5BDGqYraCZQ3L_budZsAhqLxU-MA/formResponse'
const form = document.forms['submit-to-google-sheet']
// const success = document.getElementById('success');
form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => console.log('Success!', response))


        .catch(error => console.error('Error!', error.message))

})


function message_send() {

    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("wait_mess").style.display = "block";



    setTimeout(() => {


        chat_bottom();

        document.getElementById("chat_entry").value = "";
        document.getElementById("wait_mess").style.display = "none";
        document.getElementById("submit-btn").style.display = "block";

        // location.reload();

    }, 4000);

}


// =================================Data Load=================================


let old_len = 0;

let SHEET_ID = '1cq_jA_NO--lf5cT3IDSvqQdKuqRs0gGzw4KzmfQXH90'
let SHEET_TITLE = 'Form responses 1';
let SHEET_RANGE = 'B2:D100'

let FULL_URL = ('https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/gviz/tq?sheet=' + SHEET_TITLE + '&range=' + SHEET_RANGE);

function load() {
    fetch(FULL_URL)
        .then(res => res.text())
        .then(rep => {
            let data = JSON.parse(rep.substr(47).slice(0, -2));


            let length = data.table.rows.length;

            // console.log(data);
            // console.log(data.table.rows[2].c[0].v);

            // document.getElementById("abc").innerHTML = data.table.rows[2].c[0].v;

            document.getElementById("inside_chat_area").innerHTML = "";


            console.log("Chats Load, load function run");
            let i;
            for (i = 0; i < length; i++) {

                if (data.table.rows[i].c[0].v == sndr_name && data.table.rows[i].c[1].v == group_cd) {

                    let tmp1 = `<div class="send_message">
                    <p>${"You : " + data.table.rows[i].c[2].v}</p>
                    </div>`;
                    document.getElementById("inside_chat_area").innerHTML += tmp1;

                }
                else if (data.table.rows[i].c[0].v != sndr_name && data.table.rows[i].c[1].v == group_cd && sndr_name.trim() != "") {
                    let tmp2 = `
                    <div class="received_message">
                    <p>${data.table.rows[i].c[0].v + ": " + data.table.rows[i].c[2].v}</p>
                    </div>`;
                    document.getElementById("inside_chat_area").innerHTML += tmp2;
                }



            }
            old_len = i;

            chat_bottom();
            console.log("Load Chats : " + old_len);

        })
}



function msg_update() {

    fetch(FULL_URL)
        .then(res => res.text())
        .then(rep => {
            let data2 = JSON.parse(rep.substr(47).slice(0, -2));


            let length2 = data2.table.rows.length;

            if (length2 > old_len) {

                console.log("Chat add or update, msg update fun run");
                let k;
                for (k = old_len; k < length2; k++) {
                    if (data2.table.rows[k].c[0].v == sndr_name && data2.table.rows[k].c[1].v == group_cd) {

                        let tmp1 = `<div class="send_message">
                    <p>${"You : " + data2.table.rows[k].c[2].v}</p>
                    </div>`;
                        document.getElementById("inside_chat_area").innerHTML += tmp1;

                    }
                    else if (data2.table.rows[k].c[0].v != sndr_name && data2.table.rows[k].c[1].v == group_cd && sndr_name.trim() != "") {
                        let tmp2 = `
                    <div class="received_message">
                    <p>${data2.table.rows[k].c[0].v + ": " + data2.table.rows[k].c[2].v}</p>
                    </div>`;
                        document.getElementById("inside_chat_area").innerHTML += tmp2;
                    }
                }

                old_len = k;

                chat_bottom();

                console.log("After adding, total chats no : " + old_len);
            }


        })

}





// =========================Chat Scroll to Bottom=========================

function chat_bottom() {
    var scrollbarElement = document.getElementById('chat_area');
    scrollbarElement.scrollTop = scrollbarElement.scrollHeight;
}


// ===============================Form Auto Save===================================

// function alphaOnly(event) {
//     var key = event.keyCode;
//     return ((key >= 65 && key <= 90) || key == 8);
// };

// ===============================Form Auto Save===================================

function save(idv) {

    if (localStorage.getItem(idv) != null) {

        let b = document.getElementById(idv);
        b.value = localStorage.getItem(idv);
    }

    // setInterval(() => {

    document.getElementById(idv).addEventListener("change", () => {



        if (document.getElementById(idv).value != localStorage.getItem(idv)) {

            console.log("local storage data update");

            let a = document.getElementById(idv).value;
            localStorage.setItem(idv, a);
        }


    })

    // }, 1000);

}



// ==============================================================================



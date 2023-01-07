function loadExtension() {

    // Find the button with id resp_btn if found it will return from the fucntion
    const button1 = document.querySelector('button[id="resp_btn"]');
    if (button1 && button1.innerText === "Response") {
        console.log("Button", button1, "Inside loop")
        return;
      }


    //create a button with with name Response and id resp_btn
    var resp_btn = document.createElement("button");
    resp_btn.innerHTML = "Response";
    resp_btn.id = "resp_btn";

      

    // Find the send button add above button as a child to parent node
    var sendBtn = document.querySelector("div[role='button'][aria-label='Send ‪(Ctrl-Enter)‬']");
    if (sendBtn){
    sendBtn.parentNode.appendChild(resp_btn);
    }

    async function myFunction() {
        var spans = document.querySelectorAll('span');
        for (var i = 0; i < spans.length; i++) {
        var span = spans[i];
        if (span.hasAttribute('email') && span.hasAttribute('name')) {
            var email = span.getAttribute('email');
            var name = span.getAttribute('name')
            console.log(email, name);
            }
        }

        const elements = document.querySelectorAll('*');
        const element = Array.prototype.find.call(elements, element => element.textContent.includes("New message") || element.textContent.includes("Compose:"));
        if (element) {
            // Element with the text "New message" or "Compose:" was found
            var selected_element = document.querySelector('[aria-label="Message Body"][role="textbox"]');
            var type = "new_mail"
            console.log("**********************************")
            console.log("New element Selected", selected_element)
            var msg_text = selected_element.innerText;
            var ddata = {
                'msg_id': null,
                "msg_body": msg_text,
                "type": type
            };
        }else{
            var selected_element = document.querySelector('.adn.ads');
            var type = "reply_mail"
            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
            console.log("Unable to find element", selected_element)
            var legacyMessageId = selected_element.getAttribute('data-legacy-message-id');

            var sub_element = document.querySelector('h2[class="hP"][data-legacy-thread-id="'+legacyMessageId+'"]');

            var subject_text = sub_element.textContent;
            console.log("Subject Text", subject_text)

            var spans = selected_element.querySelectorAll('span');


            for (var i = 0; i < spans.length; i++) {
            var span = spans[i];
            if (span.hasAttribute('email') && span.hasAttribute('name')) {
                var email = span.getAttribute('email');
                var name = span.getAttribute('name')
                console.log(email, name);
                break;
                }
            }
            var msg_text = selected_element.innerText;
            var ddata = {
                'msg_id': legacyMessageId,
                "msg_body": msg_text,
                "type": type,
                "email": email,
                "name" : name,
                "subject": subject_text
            };
        }
        console.log("Selected Element", type)
        console.log("Message Text:", msg_text)

        const apiUrl = "https://7574-122-160-141-52.in.ngrok.io";
        console.log("DATA: ", ddata)
        await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(ddata),
        })
        .then((response) => {
        return response.json();
        })
        .then((data) => {
            console.log(data);
            if(type === "new_mail"){
                // hint utterance to the user
                const elements = document.querySelectorAll('*');
                const element = Array.prototype.find.call(elements, element => element.textContent.includes("New message") || element.textContent.includes("Compose:"));
                if (element) {
                    // Element with the text "New message" or "Compose:" was found
                    var selected_element = document.querySelector('[aria-label="Message Body"][role="textbox"]');
                    selected_element.innerText = data.data
                    }
                const subject_box = document.querySelector("input[name='subjectbox']");
                console.log("Subject Box Element", subject_box, "\n",data.subject)
                if (subject_box){
                    subject_box.value = data.subject
                }
            }
            if(type === "reply_mail"){
                var selector = "div.Am.aO9.Al.editable.LW-avf.tS-tW[aria-label='Message Body']";
                var div = document.querySelector(selector);
                var text = data.data;
                div.innerHTML = text;
            }
        })
        .catch((error) => {
        console.error(error);
        });

    }
    resp_btn.addEventListener("click",async () => {
        await myFunction();
      });

}

setInterval(loadExtension, 5000);
const btn_signOut = document.getElementById("sign-out");
const btnNewConversation = document.getElementById("btn-newConversation");
const listMess = document.querySelector(".list-messages");
const sendMessForm = document.getElementById("send-messages-form");

let basket = async function () {
  try {
    const chatDocRef = db
      .collection("conversation")
      .doc("con1")
      .collection("chat");

    const data = await chatDocRef.get();
    console.log(data);

    listMess.innerHTML = null;
    let messArr = [];
    data.forEach((doc) => {
      let dataFromDB = doc.data().messages;
      dataFromDB.forEach((item) => {
        messArr.push(item);
      });
    });

    messArr.sort(function (a, b) {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
    messArr.forEach((item) => {
      listMess.innerHTML += `
              <div class="message-container ${
                auth.currentUser.email === item.email ? `mine` : `their`
              }">
                  ${
                    auth.currentUser.email !== item.email
                      ? `<div class="owner">${item.email}</div>`
                      : ``
                  }
                  <div class="content">${item.content}
                    <span style="display: block; font-size: 13px; opacity: 75%">${
                      new Date(item.timestamp).getHours() +
                      ":" +
                      new Date(item.timestamp).getMinutes()
                    }</span>
                  </div>
                  
              </div>
            `;
    });
  } catch (err) {
    console.log(err);
  }
};
basket();

btn_signOut.addEventListener("click", function (e) {
  e.preventDefault();
  const cf = confirm("Bạn có chắc chắn muốn đăng xuất ko?");
  if (cf) {
    auth.signOut();
    window.location.href = "login.html";
  }
});

sendMessForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const message = sendMessForm.message.value;

  async function sendMess() {
    try {
      const chatdocRef = db
        .collection("conversation")
        .doc("con1")
        .collection("chat")
        .doc(auth.currentUser.uid);

      await chatdocRef.set(
        {
          messages: firebase.firestore.FieldValue.arrayUnion({
            // Sử dụng arrayUnion để thêm một phần tử vào mảng
            email: auth.currentUser.email,
            content: message,
            timestamp: new Date().toString(),
          }),
        },
        { merge: true }
      );

      sendMessForm.reset();
    } catch (err) {
      console.log(err);
    }
  }
  sendMess();
  basket();
});

btnNewConversation.addEventListener("click", function (e) {
  e.preventDefault();
});

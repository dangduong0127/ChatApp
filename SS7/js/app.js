const btn_signOut = document.getElementById("sign-out");
const btnNewConversation = document.getElementById("btn-newConversation");
const listMess = document.querySelector(".list-messages");
const sendMessForm = document.getElementById("send-messages-form");

let basket = async function () {
  try {
    const data = await db
      .collection("conversation")
      .doc("con1")
      .collection("chat")
      .get();
    console.log(data);

    listMess.innerHTML = null;
    data.forEach((doc) => {
      let dataFromDB = doc.data().messages;
      console.log(dataFromDB);

      dataFromDB.forEach((item) => {
        listMess.innerHTML += `
        <div class="message-container ${
          auth.currentUser.email === item.email ? `mine` : `their`
        }">
            ${
              auth.currentUser.email !== item.email
                ? `<div class="owner">${item.email}</div>`
                : ``
            }
            <div class="content">${item.content}</div>
        </div>
      `;
      });
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
          }),
        },
        { merge: true }
      );
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

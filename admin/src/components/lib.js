
export function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Проверяем, начинается ли cookie с нужного имени
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  console.log(document.cookie);
  return cookieValue;
}


export function getCSRF(content_type = "application/json"){
   const csrfToken = getCookie("csrftoken");
    const prm = {
            "Content-Type": content_type,
            "X-CSRFToken": csrfToken
    } 
    return prm;
}
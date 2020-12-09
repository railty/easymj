export async function callServer(method, url, data) {
    let p = new Promise((resolve, reject) => {
        
        let params = new URLSearchParams();
        let ks = Object.keys(data);
        for (let k of ks){
            params.set(k, data[k]);
        }
        url = url + "?" + params.toString();

        let http = new XMLHttpRequest();
        http.open(method, url, true);
        //http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        http.onreadystatechange = function () {//Call a function when the state changes.
            if (http.readyState == 4) {
                 if (http.status == 200){
                    let rc = http.responseText;
                    resolve(rc);
                 }
                 else{
                     resolve({
                         code:'warning',
                         message: http.statusText
                     });
                 }
            }
        }

        http.send();
    });
    return p;
}

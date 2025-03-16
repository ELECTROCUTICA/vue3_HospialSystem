let timer = null;

self.addEventListener("message", (e) => {       //显示实时时间用
    if (e.data === "start") {
        timer = setInterval(() => {
            self.postMessage("tick");
        }, 1000);
    }
    else if (e.data === "stop") {
        clearInterval(timer);
        timer = null;
    }
});
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((reg) => console.log("Service worker has been registered."))
            .catch((err) =>
                console.error(`Error during service worker registration:${err}`)
            );
    });
} else {
    console.log("Service worker is not supported by browser.");
}

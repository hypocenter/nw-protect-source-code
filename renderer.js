(() => {
    "use strict";

    console.log("Renderer Started");
    setTimeout(() => {
        let node = document.createElement("ul")
        node.innerHTML = "<li>好得很</li>"
        document.body.appendChild(node)
    }, 2000);

    require("./browser").test()
})();
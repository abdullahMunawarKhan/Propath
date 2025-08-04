// utils/useChatbaseBot.js
import { useEffect } from 'react';

export const useChatbaseBot = () => {
  useEffect(() => {
    const scriptId = 'vJrYLCy7BVk1q-e-NXzIg';

    if (!document.getElementById(scriptId)) {
      const embedScript = document.createElement('script');
      embedScript.id = scriptId;
      embedScript.src = 'https://www.chatbase.co/embed.min.js';
      embedScript.domain = 'www.chatbase.co';

      const loader = document.createElement('script');
      loader.innerHTML = `
        (function(){
          if(!window.chatbase || window.chatbase("getState") !== "initialized"){
            window.chatbase = (...arguments) => {
              if(!window.chatbase.q) window.chatbase.q = [];
              window.chatbase.q.push(arguments);
            };
            window.chatbase = new Proxy(window.chatbase, {
              get(target, prop) {
                if(prop === "q") return target.q;
                return (...args) => target(prop, ...args);
              }
            });
          }
          const onLoad = function(){
            const script = document.createElement("script");
            script.src = "https://www.chatbase.co/embed.min.js";
            script.id = "vJrYLCy7BVk1q-e-NXzIg";
            script.domain = "www.chatbase.co";
            document.body.appendChild(script);
          };
          if(document.readyState === "complete"){
            onLoad();
          } else {
            window.addEventListener("load", onLoad);
          }
        })();
      `;
      document.body.appendChild(loader);
    }
  }, []);
};
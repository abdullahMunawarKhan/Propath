// utils/useChatbaseBot.js
import { useEffect } from 'react';

export const useChatbaseBot = () => {
    useEffect(() => {
        const scriptId = 'FU0ZrnakXWRP5ZSPZUPHi';

        if (!document.getElementById(scriptId)) {
            const loader = document.createElement('script');
            loader.id = scriptId + '-loader';
            loader.innerHTML = `
                (function(){
                    if(!window.chatbase||window.chatbase("getState")!=="initialized"){
                        window.chatbase=(...arguments)=>{
                            if(!window.chatbase.q){window.chatbase.q=[]}
                            window.chatbase.q.push(arguments)
                        };
                        window.chatbase=new Proxy(window.chatbase,{
                            get(target,prop){
                                if(prop==="q"){return target.q}
                                return(...args)=>target(prop,...args)
                            }
                        })
                    }
                    const onLoad=function(){
                        const script=document.createElement("script");
                        script.src="https://www.chatbase.co/embed.min.js";
                        script.id="FU0ZrnakXWRP5ZSPZUPHi";
                        script.domain="www.chatbase.co";
                        document.body.appendChild(script)
                    };
                    if(document.readyState==="complete"){
                        onLoad()
                    }else{
                        window.addEventListener("load",onLoad)
                    }
                })();
            `;
            document.body.appendChild(loader);
        }

        // Assistance pop message (optional UI)
        const setupAssistPop = () => {
            const popId = 'chat-assist-pop';
            const closedKey = 'chatAssistPopClosed';
            const alreadyClosed = typeof window !== 'undefined' && window.localStorage?.getItem(closedKey) === 'true';
            const exists = document.getElementById(popId);

            if (alreadyClosed || exists) return undefined;

            const container = document.createElement('div');
            container.id = popId;
            container.style.position = 'fixed';
            container.style.bottom = '110px';
            container.style.right = '24px';
            container.style.maxWidth = '320px';
            container.style.background = 'white';
            container.style.border = '1px solid rgba(0,0,0,0.08)';
            container.style.borderRadius = '12px';
            container.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            container.style.padding = '12px 16px 12px 16px';
            container.style.zIndex = '2147483647';
            container.style.cursor = 'pointer';
            container.style.display = 'flex';
            container.style.alignItems = 'flex-start';
            container.style.gap = '10px';

            const text = document.createElement('div');
            text.style.color = '#111827';
            text.style.fontSize = '14px';
            text.style.lineHeight = '1.35';
            text.style.fontWeight = '500';
            text.textContent = 'Need assistance? I am here to assist.';

            const closeBtn = document.createElement('button');
            closeBtn.setAttribute('aria-label', 'Close assistance message');
            closeBtn.innerHTML = '\u2715';
            closeBtn.style.border = 'none';
            closeBtn.style.background = 'transparent';
            closeBtn.style.color = '#6B7280';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '14px';
            closeBtn.style.marginLeft = 'auto';

            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                try { window.localStorage?.setItem(closedKey, 'true'); } catch {}
                container.remove();
            });

            container.addEventListener('click', () => {
                try {
                    if (window.chatbase) {
                        window.chatbase('open');
                    }
                } catch {}
            });

            container.appendChild(text);
            container.appendChild(closeBtn);

            const arrow = document.createElement('div');
            arrow.style.position = 'absolute';
            arrow.style.bottom = '-6px';
            arrow.style.right = '20px';
            arrow.style.width = '12px';
            arrow.style.height = '12px';
            arrow.style.background = 'white';
            arrow.style.borderLeft = '1px solid rgba(0,0,0,0.08)';
            arrow.style.borderBottom = '1px solid rgba(0,0,0,0.08)';
            arrow.style.transform = 'rotate(45deg)';
            container.appendChild(arrow);

            const showTimer = setTimeout(() => {
                document.body.appendChild(container);
            }, 1200);

            const autoHideTimer = setTimeout(() => {
                if (document.getElementById(popId)) {
                    container.remove();
                }
            }, 12000);

            return () => {
                clearTimeout(showTimer);
                clearTimeout(autoHideTimer);
                const mounted = document.getElementById(popId);
                if (mounted) mounted.remove();
            };
        };

        const cleanup = setupAssistPop();
        return () => {
            if (typeof cleanup === 'function') cleanup();
        };
    }, []);
};


'use client'
import { useEffect, useRef } from "react";

const useTradingWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef(JSON.stringify(config)); // stabilize config

  useEffect(() => {
    if (!containerRef.current) return;

    // Reset if config actually changes
    const newConfig = JSON.stringify(config);
    if (configRef.current !== newConfig) {
      containerRef.current.innerHTML = "";
      delete containerRef.current.dataset.loaded;
      configRef.current = newConfig;
    }

    if (containerRef.current.dataset.loaded) return;

    containerRef.current.innerHTML = `
      <div class="tradingview-widget-container__widget"
           style="width:100%; height:${height}px;"></div>
    `;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = newConfig;

    containerRef.current.appendChild(script);
    containerRef.current.dataset.loaded = "true";

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        delete containerRef.current.dataset.loaded;
      }
    };
  }, [scriptUrl, config, height]); 

  return containerRef;
};

export default useTradingWidget;

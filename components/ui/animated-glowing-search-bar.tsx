"use client";

import React from "react";

interface SearchComponentProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const glowLayerStyle = `
  .glow-container { position: relative; display: flex; align-items: center; justify-content: center; }
  .glow-group { position: relative; display: flex; align-items: center; justify-content: center; }

  .glow-layer {
    position: absolute; z-index: -1; overflow: hidden; height: 100%; width: 100%; border-radius: 12px;
  }
  .glow-layer::before {
    content: ''; position: absolute; z-index: -2; background-repeat: no-repeat;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    transition: transform 2s ease;
  }

  /* Layer 1 */
  .glow-l1 { max-height: 70px; max-width: 314px; filter: blur(3px); }
  .glow-l1::before {
    width: 999px; height: 999px; transform: translate(-50%, -50%) rotate(60deg);
    background-image: conic-gradient(#000, #402fb5 5%, #000 38%, #000 50%, #cf30aa 60%, #000 87%);
  }
  .glow-group:hover .glow-l1::before { transform: translate(-50%, -50%) rotate(-120deg); }
  .glow-group:focus-within .glow-l1::before { transform: translate(-50%, -50%) rotate(420deg); transition-duration: 4s; }

  /* Layer 2-4 */
  .glow-l2, .glow-l3, .glow-l4 { max-height: 65px; max-width: 312px; filter: blur(3px); }
  .glow-l2::before, .glow-l3::before, .glow-l4::before {
    width: 600px; height: 600px; transform: translate(-50%, -50%) rotate(82deg);
    background-image: conic-gradient(rgba(0,0,0,0), #18116a, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 50%, #6e1b60, rgba(0,0,0,0) 60%);
  }
  .glow-group:hover .glow-l2::before, .glow-group:hover .glow-l3::before, .glow-group:hover .glow-l4::before {
    transform: translate(-50%, -50%) rotate(-98deg);
  }
  .glow-group:focus-within .glow-l2::before, .glow-group:focus-within .glow-l3::before, .glow-group:focus-within .glow-l4::before {
    transform: translate(-50%, -50%) rotate(442deg); transition-duration: 4s;
  }

  /* Layer 5 — bright accent */
  .glow-l5 { max-height: 63px; max-width: 307px; border-radius: 8px; filter: blur(2px); }
  .glow-l5::before {
    width: 600px; height: 600px; transform: translate(-50%, -50%) rotate(83deg);
    background-image: conic-gradient(rgba(0,0,0,0) 0%, #a099d8, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 50%, #dfa2da, rgba(0,0,0,0) 58%);
    filter: brightness(1.4);
  }
  .glow-group:hover .glow-l5::before { transform: translate(-50%, -50%) rotate(-97deg); }
  .glow-group:focus-within .glow-l5::before { transform: translate(-50%, -50%) rotate(443deg); transition-duration: 4s; }

  /* Layer 6 — inner ring */
  .glow-l6 { max-height: 59px; max-width: 303px; filter: blur(0.5px); }
  .glow-l6::before {
    width: 600px; height: 600px; transform: translate(-50%, -50%) rotate(70deg);
    background-image: conic-gradient(#1c191c, #402fb5 5%, #1c191c 14%, #1c191c 50%, #cf30aa 60%, #1c191c 64%);
    filter: brightness(1.3);
  }
  .glow-group:hover .glow-l6::before { transform: translate(-50%, -50%) rotate(-110deg); }
  .glow-group:focus-within .glow-l6::before { transform: translate(-50%, -50%) rotate(430deg); transition-duration: 4s; }

  /* Filter icon spinner */
  .filter-spin { position: absolute; height: 42px; width: 40px; overflow: hidden; top: 7px; right: 7px; border-radius: 8px; }
  .filter-spin::before {
    content: ''; position: absolute; width: 600px; height: 600px; background-repeat: no-repeat;
    top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(90deg);
    background-image: conic-gradient(rgba(0,0,0,0), #3d3a4f, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 50%, #3d3a4f, rgba(0,0,0,0) 100%);
    filter: brightness(1.35);
    animation: spin 4s linear infinite;
  }

  /* Input mask */
  .glow-input-wrap:focus-within .input-mask { display: none; }
  .glow-input-wrap:hover .pink-mask { opacity: 0; }
`;

const SearchComponent: React.FC<SearchComponentProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: glowLayerStyle }} />
      <div className={`glow-container ${className}`}>
        <div className="glow-group">
          <div className="glow-layer glow-l1" />
          <div className="glow-layer glow-l2" />
          <div className="glow-layer glow-l3" />
          <div className="glow-layer glow-l4" />
          <div className="glow-layer glow-l5" />
          <div className="glow-layer glow-l6" />

          <div className="glow-input-wrap" style={{ position: "relative" }}>
            <input
              placeholder={placeholder}
              type="text"
              value={value}
              onChange={onChange}
              style={{
                background: "#010201",
                border: "none",
                width: 301,
                height: 56,
                borderRadius: 8,
                color: "#fff",
                paddingLeft: 59,
                paddingRight: 59,
                fontSize: 18,
                outline: "none",
              }}
            />
            <div
              className="input-mask"
              style={{
                pointerEvents: "none",
                width: 100,
                height: 20,
                position: "absolute",
                backgroundImage: "linear-gradient(to right, transparent, black)",
                top: 18,
                left: 70,
              }}
            />
            <div
              className="pink-mask"
              style={{
                pointerEvents: "none",
                width: 30,
                height: 20,
                position: "absolute",
                background: "#cf30aa",
                top: 10,
                left: 5,
                filter: "blur(24px)",
                opacity: 0.8,
                transition: "all 2s",
              }}
            />
            <div className="filter-spin" />
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                maxHeight: 40,
                maxWidth: 38,
                height: "100%",
                width: "100%",
                isolation: "isolate",
                overflow: "hidden",
                borderRadius: 8,
                backgroundImage: "linear-gradient(to bottom, #161329, black, #1d1b4b)",
                border: "1px solid transparent",
              }}
            >
              <svg preserveAspectRatio="none" height="27" width="27" viewBox="4.8 4.56 14.832 15.408" fill="none">
                <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z" stroke="#d6d6e6" strokeWidth="1" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ position: "absolute", left: 20, top: 15 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" height="24" fill="none">
                <circle stroke="url(#search-g)" r="8" cy="11" cx="11" />
                <line stroke="url(#searchl-g)" y2="16.65" y1="22" x2="16.65" x1="22" />
                <defs>
                  <linearGradient gradientTransform="rotate(50)" id="search-g">
                    <stop stopColor="#f8e7f8" offset="0%" />
                    <stop stopColor="#b6a9b7" offset="50%" />
                  </linearGradient>
                  <linearGradient id="searchl-g">
                    <stop stopColor="#b6a9b7" offset="0%" />
                    <stop stopColor="#837484" offset="50%" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchComponent;

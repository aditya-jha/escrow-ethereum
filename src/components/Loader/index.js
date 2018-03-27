/*
 * created by aditya on 04/03/18
 */

import React from "react";

import "./style.css";

const Loader = (props) => {
    return (
        <div className="loader-wrapper">
            <svg className="spinner" width="56px" height="56px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                <circle stroke="#33709e" className="circle" fill="none" strokeWidth="6" strokeLinecap="round" cx="28" cy="28" r="25"></circle>
            </svg>
            {props.text ? <p className="text-secondary">{props.text}</p> : null}
        </div>
    )
};

export default Loader;

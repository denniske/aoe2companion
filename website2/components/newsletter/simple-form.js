import React from "react";

// a basic form
const SimpleForm = ({ status, message, className, style, onSubmitted }) => {
    let input;
    const submit = () =>
        input &&
        input.value.indexOf("@") > -1 &&
        onSubmitted({
            EMAIL: input.value
        });

    return (
        <div className={className} style={style}>
            <input
                ref={node => (input = node)}
                type="email"
                placeholder="Your email"
            />
            <button onClick={submit}>Subscribe</button>
            {status === "sending" && <div className="status" style={{ }}>sending...</div>}
            {status === "error" && (
                <div
                    style={{ color: "#C00" }}
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
            {status === "success" && (
                <div
                    style={{ color: "#0A0" }}
                    dangerouslySetInnerHTML={{ __html: message }}
                />
            )}
        </div>
    );
};

export default SimpleForm;
import React from "react";

function Input({ name, state, setState, label = false }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className=" text-base font-semibold text-primary-strong"
        >
          {name}
        </label>
      )}
      <div>
        <input
          type="text"
          name={name}
          value={state}
          onChange={(e) => setState(e.target.value)}
          className=" bg-input-background focus:outline-none text-white h-8 px-5 py-2"
        />
      </div>
    </div>
  );
}

export default Input;

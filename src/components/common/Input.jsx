import React from "react";

function Input({ name, type, placeholder, Icon, state, setState, label = false }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full px-3 mb-5">
        {label && (
          <label htmlFor={name} className="text-xs font-semibold px-1">
            {name}
          </label>
        )}
        <div className="flex">
          <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
            {Icon && <Icon className=" text-gray-400 text-lg z-10" />}
          </div>
          <input
            type={type}
            name={name}
            value={state}
            onChange={(e) => setState(e)}
            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-800"
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  );
}

export default Input;

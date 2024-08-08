import React from 'react'

const PermissionModal = ({ onAllow, onDeny })=>{
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-md shadow-md">
          <p>Do you allow notifications with sound?</p>
          <button onClick={onAllow} className="bg-blue-500 text-white p-2 rounded-md">
            Allow
          </button>
          <button onClick={onDeny} className="bg-red-500 text-white p-2 rounded-md ml-2">
            Deny
          </button>
        </div>
      </div>
    );
  }

export default PermissionModal;

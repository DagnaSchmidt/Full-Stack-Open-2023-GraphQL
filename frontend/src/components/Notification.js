import React from 'react';

const Notification = ({errorMessage}) => {
    if(!errorMessage){
        return null;
    }
  return (
    <div style={{border: '1px solid red', padding: '12px'}}>
        <p>{errorMessage}</p>
    </div>
  )
}

export default Notification;
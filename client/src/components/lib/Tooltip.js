import React from 'react';
import '../../assets/css/lib/Tooltip.css';

const Tooltip = ({ visible, text, position }) => {
  return (
    <div className={`tooltip ${visible ? 'visible' : ''}`} style={position}>
      {text}
    </div>
  );
};

export default Tooltip;

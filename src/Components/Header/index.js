import React, { useState } from 'react';
import USTP from '../../Assets/USTP logo.png';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCourse, selectYear } from '../Redux/Auth/AuthSlice';
import Logout from '../Popup/Logout';

function Header(props) {
  const [showLogout, setShowLogout] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
    dispatch(selectCourse(''));
    dispatch(selectYear(''));
  };

  const handleLogout = () => {
    setShowLogout((prevShow) => !prevShow);
  };

  return (
    <div style={{ backgroundColor: '#060e57', padding: '1px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', position: 'fixed', top: '0', left: '0', zIndex: '100' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={USTP} alt="USTP logo" style={{ width: '45px', height: '45px', margin: '5px', cursor: 'pointer' }} onClick={handleNavigateToHome} />
        <h1 style={{ color: 'white', fontSize: '15px', marginLeft: '10px', cursor: 'pointer' }} onClick={handleNavigateToHome}>
          UNIVERSITY OF SCIENCE AND TECHNOLOGY OF SOUTHERN PHILIPPINES
        </h1>
      </div>
      <span style={{ color: 'white', fontSize: '16px', marginRight: '15px', marginTop: '-4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => { handleLogout(); }}>
        Logout
      </span>
      {showLogout ? <Logout setShowLogout={setShowLogout} handleLogout={handleLogout} /> : null}
    </div>
  );
}

export default Header;

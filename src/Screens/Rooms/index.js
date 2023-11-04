import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import add from '../../Assets/addicon2.png'
import editicon from '../../Assets/edit1.png'
import deleteicon from '../../Assets/delete.png';
import AddRooms from '../../Components/Popup/Rooms/Add';
import DeleteRooms from '../../Components/Popup/Rooms/Delete';
import UpdateRooms from '../../Components/Popup/Rooms/Update';
import { selectType, selectRoom} from '../../Components/Redux/Auth/AuthSlice';

function Rooms() {
  const dispatch = useDispatch();
  const [showAddRooms , setShowAddRooms] = useState(false)
  const [showUpdateRooms , setShowUpdateRooms] = useState(false)
  const [showDeleteRooms , setShowDeleteRooms] = useState(false)
  const [roomsData, setRoomsData] = useState([]);
  const selectedCourse = useSelector(state => state.auth.course);
  const isAdmin = useSelector(state => state.auth.isAdmin);

  const handleNoClickRooms = () => {
    setShowAddRooms(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
  };

  const handleCancelClickRooms = (room) => {
    setShowUpdateRooms(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
    dispatch(selectRoom(room.roomID)); 
  }

  const handleNoDeleteClickRooms = (room) => {
    setShowDeleteRooms(prevShow => !prevShow);
    dispatch(selectType('Lecture'));
    dispatch(selectRoom(room.roomID)); 
  }  

  const handleNoClickRooms2 = () => {
    setShowAddRooms(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
  };

  const handleCancelClickRooms2 = (room) => {
    setShowUpdateRooms(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
    dispatch(selectRoom(room.roomID)); 
  }

  const handleNoDeleteClickRooms2 = (room) => {
    setShowDeleteRooms(prevShow => !prevShow);
    dispatch(selectType('Laboratory'));
    dispatch(selectRoom(room.roomID)); 
  }  


  useEffect(() => {
    // Fetch data from the API
    fetch('https://classscheeduling.pythonanywhere.com/get_room_json/')
      .then(response => response.json())
      .then(data => {
        // Filter the data based on the selected course
        const filteredRooms = data.filter(room => room.course === selectedCourse);
        setRoomsData(filteredRooms);
      })
      .catch(error => console.log(error));
  }, [selectedCourse]);

  const lectureRooms = roomsData.filter(room => room.roomtype === 'Lecture');
  const laboratoryRooms = roomsData.filter(room => room.roomtype === 'Laboratory');

  return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <h2>Rooms</h2>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

              {/* Lecture */}
              <h3>Lecture</h3>
              {isAdmin && (
              <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}} 
              onClick={() => {handleNoClickRooms();
                setShowUpdateRooms(false);
                setShowDeleteRooms(false)}}/>
                )}
              {showAddRooms ? <AddRooms setShowAddRooms={setShowAddRooms} handleNoClickRooms={handleNoClickRooms} /> : null}
              {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms} /> : null}

            </div>

            <div>
              <table className="schedule-table">
                <thead>
                  <tr>
                    
                    
                  </tr>
                </thead>
                <tbody>
                  {lectureRooms.map((room) => (
                    <tr key={room.roomID}>
                      <td>
                        <span style={{ fontSize: '17px', fontWeight: 'bold' }}>
                          {room.building_number} - {room.roomname}
                        </span>
                      </td>
                      {isAdmin && (
                      <td>
                          <img
                            src={editicon}
                            alt="edit icon"
                            style={{ width: '20px', height: '20px', cursor: 'pointer', marginRigh: '20%' }}
                            onClick={() => {
                              handleCancelClickRooms(room);
                              setShowAddRooms(false);
                      setShowDeleteRooms(false);
                            }}
                          />

                          <img
                            src={deleteicon}
                            alt="delete icon"
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            onClick={() => {handleNoDeleteClickRooms(room);
                      setShowUpdateRooms(false);
                      setShowAddRooms(false);
                            }}
                          />
                          </td>
                      )}
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms} /> : null}
            {showUpdateRooms ? <UpdateRooms setShowUpdateRooms={setShowUpdateRooms} handleCancelClickRooms={handleCancelClickRooms} /> : null}
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>


              {/* Laboratory */}
            <h3>Laboratory</h3>
            {isAdmin && ( 
              <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}}
                 onClick={() => {handleNoClickRooms2();
                  setShowUpdateRooms(false);
                  setShowDeleteRooms(false)}}/>
            )}
                {showAddRooms ? <AddRooms setShowAddRooms={setShowAddRooms} handleNoClickRooms={handleNoClickRooms2} /> : null}

              {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms2} /> : null}
            </div>

            <div>
              <table className="schedule-table">
                <thead>
                  <tr>
                    
                    
                  </tr>
                </thead>
                <tbody>
                  {laboratoryRooms.map((room) => (
                    <tr key={room.roomID}>
                      <td>
                        <span style={{ fontSize: '17px', fontWeight: 'bold' }}>
                          {room.building_number} - {room.roomname}
                        </span>
                      </td>
                      {isAdmin && (
                      <td>
                          <img
                            src={editicon}
                            alt="edit icon"
                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            onClick={() => {
                              handleCancelClickRooms2(room);
                              setShowAddRooms(false);
                      setShowDeleteRooms(false);
                            }}
                          />

                          <img
                            src={deleteicon}
                            alt="delete icon"
                            style={{ width: '20px', height: '20px', cursor: 'pointer', marginRigh: '80%' }}
                            onClick={() => {handleNoDeleteClickRooms2(room);
                      setShowUpdateRooms(false);
                      setShowAddRooms(false);
                            }}
                          />
                          </td>
                      )}
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms2} /> : null}
            {showUpdateRooms ? <UpdateRooms setShowUpdateRooms={setShowUpdateRooms} handleCancelClickRooms={handleCancelClickRooms2} /> : null}
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}

export default Rooms;
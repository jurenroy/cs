import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import add from '../../Assets/addicon2.png'
import editicon from '../../Assets/edit1.png'
import deleteicon from '../../Assets/delete.png';
import deleteicon2 from '../../Assets/delete2.png';
import AddRooms from '../../Components/Popup/Rooms/Lecture/Add';
import DeleteRooms from '../../Components/Popup/Rooms/Delete';
import UpdateRooms from '../../Components/Popup/Rooms/Update';

function Rooms() {
  const [showAddRooms , setShowAddRooms] = useState(false)
  const [showUpdateRooms , setShowUpdateRooms] = useState(false)
  const [showDeleteRooms , setShowDeleteRooms] = useState(false)
  const [isLectureChecked, setIsLectureChecked] = useState(false);
  const [isLaboratoryChecked, setIsLaboratoryChecked] = useState(false);
  const [roomsData, setRoomsData] = useState([]);
  const selectedCourse = useSelector(state => state.auth.course);

  const handleNoClickRooms = () => {
    setShowAddRooms(prevShow => !prevShow);
  };

  const handleCancelClickRooms = () => {
    setShowUpdateRooms(prevShow => !prevShow);
  }

  const handleNoDeleteClickRooms = (/*course*/) => {
  //   dispatch(selectCourse(course.abbreviation));
    setShowDeleteRooms(prevShow => !prevShow);
  }  

  const handleLectureCheckboxChange = (event) => {
    setIsLectureChecked(event.target.checked);
  };

  const handleLaboratoryCheckboxChange = (event) => {
    setIsLaboratoryChecked(event.target.checked);
  };

  useEffect(() => {
    // Fetch data from the API
    fetch('http://localhost:8000/get_room_json/')
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
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={isLectureChecked}
                onChange={handleLectureCheckboxChange}
              />
              <h3>Lecture</h3>
              <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}} 
              onClick={() => {handleNoClickRooms();
                setShowUpdateRooms(false);
                setShowDeleteRooms(false)}}/>
              {showAddRooms ? <AddRooms setShowAddRooms={setShowAddRooms} handleNoClickRooms={handleNoClickRooms} /> : null}
              {isLectureChecked ? 
                <img src={deleteicon} alt="delete icon" style={{ width: '20px', height: '20px', marginLeft: '10px', cursor: 'pointer'}}
                onClick={() => {handleNoDeleteClickRooms();
                  setShowUpdateRooms(false);
                  setShowAddRooms(false)}}/> 
                  
                :
                <img src={deleteicon2} alt="delete icon" style={{ width: '20px', height: '20px', marginLeft: '10px', cursor: 'not-allowed'}}/>
            }
              {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms} /> : null}

            </div>
            {lectureRooms.map((room) => (
                <div key={room.roomID}>
                    <input type='checkbox'></input>
                    <span style={{fontSize: '17px', fontWeight: 'bold'}}>{room.building_number} - {room.roomname}</span>
                    <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}  
                     onClick={() => {handleCancelClickRooms();
                      setShowAddRooms(false);
                      setShowDeleteRooms(false)}}/>

                    <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}  
                    onClick={() => {handleNoDeleteClickRooms();
                      setShowUpdateRooms(false);
                      setShowAddRooms(false)}}/> 
                 </div>
            ))}
            {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms} /> : null}
            {showUpdateRooms ? <UpdateRooms setShowUpdateRooms={setShowUpdateRooms} handleCancelClickRooms={handleCancelClickRooms} /> : null}
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={isLaboratoryChecked}
                onChange={handleLaboratoryCheckboxChange}
              />
              <h3>Laboratory</h3>
              <img src={add} alt="add icon" style={{ width: '15px', height: '15px', marginLeft: '10px', borderRadius: '50%', border: '2px solid black', cursor: 'pointer'}}
                 onClick={() => {handleNoClickRooms();
                  setShowUpdateRooms(false);
                  setShowDeleteRooms(false)}}/>
                {showAddRooms ? <AddRooms setShowAddRooms={setShowAddRooms} handleNoClickRooms={handleNoClickRooms} /> : null}

              {isLaboratoryChecked ? 
                <img src={deleteicon} alt="delete icon" style={{ width: '20px', height: '20px', marginLeft: '10px', cursor: 'pointer'}}
                onClick={() => {handleNoDeleteClickRooms();
                  setShowUpdateRooms(false);
                  setShowAddRooms(false)}}/>  
                :
                <img src={deleteicon2} alt="delete icon" style={{ width: '20px', height: '20px', marginLeft: '10px', cursor: 'not-allowed'}}/>
            }
             {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms} /> : null}
            </div>
            {laboratoryRooms.map((room) => (
              <div key={room.roomID}>
                <input type='checkbox'></input>
                <span style={{fontSize: '17px', fontWeight: 'bold'}}>{room.building_number} - {room.roomname}</span>
                <img src={editicon} alt="edit icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}
                 onClick={() => {handleCancelClickRooms();
                  setShowAddRooms(false);
                  setShowDeleteRooms(false)}}/>

                <img src={deleteicon} alt="delete icon" style={{ width: '15px', height: '15px', marginLeft: '10px', cursor: 'pointer'}}
                  onClick={() => {handleNoDeleteClickRooms();
                  setShowUpdateRooms(false);
                  setShowAddRooms(false)}}/> 
              </div>
            ))}
            {showDeleteRooms ? <DeleteRooms setShowDeleteRooms={setShowDeleteRooms} handleNoDeleteClickRooms={handleNoDeleteClickRooms} /> : null}
            {showUpdateRooms ? <UpdateRooms setShowUpdateRooms={setShowUpdateRooms} handleCancelClickRooms={handleCancelClickRooms} /> : null}
        </div>
      </div>
      <div>
        

        
      </div>
    </div>
  );
}

export default Rooms;

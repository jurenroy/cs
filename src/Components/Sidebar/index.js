import React, { useEffect, useState } from 'react';
import list from '../../Assets/listicon.png';
import add from '../../Assets/addicon.png';
import edit from '../../Assets/edit1.png';
import AddCourse from '../Popup/Course/Add';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectCourse } from '../Redux/Auth/AuthSlice';
import UpdateCourse from '../Popup/Course/Update';
import DeleteCourse from '../Popup/Course/Delete';
import AddRooms from '../Popup/Rooms/Add';

function Sidebar() {
  const [courseData, setCourseData] = useState([]);
  const [show , setShow] = useState(false)
  const [show2 , setShow2] = useState(false)
  const [show3 , setShow3] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNoClick = () => {
    setShow(prevShow => !prevShow);
  };

  const handleCancelClick = () => {
    setShow2(prevShow => !prevShow);
  }

  const handleNoDeleteClick = (course) => {
    dispatch(selectCourse(course.abbreviation));
    setShow3(prevShow => !prevShow);
  }  

  useEffect(() => {
    fetch('http://127.0.0.1:8000/get_course_json/')
      .then(response => response.json())
      .then(data => setCourseData(data))
      .catch(error => console.log(error));
  }, []);

  const navigateToRooms = (course) => {
    dispatch(selectCourse(course.abbreviation));
    navigate(`/${course.abbreviation}`); // Use the course abbreviation as a parameter in the URL
  };  

  return (
    <div style={{ backgroundColor: '#060e57', width: '15%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <img src={list} alt="list icon" style={{ width: '25px', height: '25px' }} />
        <h3 style={{ color: 'white', marginTop: '0px', marginLeft: '10px' }}>Courses</h3>
        <img 
          src={add}
          alt="add icon" 
          style={{ width: '20px', height: '20px', marginTop: '1px', marginLeft: '10px', borderRadius: '50%', border: '2px solid white', cursor:'pointer'}} 
          onClick={handleNoClick}
        />
        {show ? <AddCourse setShow={setShow} handleNoClick={handleNoClick}/>: null}
      </div>
      <ul style={{ listStyleType: 'none', marginLeft: '-20px', width: '60%' }}>
        {courseData.map(course => (
          <li key={course.courseID} style={{ backgroundColor: 'gold', marginBottom: '20px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px' }} >
            <span style={{cursor: 'pointer', fontSize: '20px', fontWeight: 'bold'}} onClick={() => navigateToRooms(course)}>{course.abbreviation}</span>

            <img 
            src={edit} 
            alt="edit icon" 
            style={{ width: '25px', height: '25px', marginRight: '10px', cursor: 'pointer' }} 
            onClick={() => {handleCancelClick(); dispatch(selectCourse(course.abbreviation));}}/>
            {show2 ? <UpdateCourse setShow2={setShow2} handleNoClick={handleCancelClick}/>: null}

            <img 
            src={add} 
            alt="add icon" 
            style={{position: 'absolute' ,width: '15px', height: '15px', marginLeft: '8.2%', marginBottom: '45px', borderRadius: '50%', border: '2px solid white', cursor:'pointer', transform: 'rotate(45deg)'}}
            onClick={() => handleNoDeleteClick(course)}/>
            {show3 ? <DeleteCourse setShow3={setShow3} handleNoClick={handleNoDeleteClick}/>: null}

          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TimePicker from '../../../TimePicker';

const UpdateTimeslot = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.college);
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedType = useSelector(state => state.auth.type);
  const selectedTime = useSelector(state => state.auth.time);
  const selectedStarttime = useSelector(state => state.auth.starttime)
  const selectedEndtime = useSelector(state => state.auth.endtime)
  const navigate = useNavigate();

  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset error to an empty string when starttime or endtime changes
    setError('');
  }, [starttime, endtime]);

  // State for tracking dragging functionality
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: (window.innerWidth - 400) / 2, // 400 is the width of the component
    y: (window.innerHeight - 300) / 2, // 300 is the height of the component
  });
  
  const dragStartPos = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartPos.current = null;
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;
    
      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });
    
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMilitaryTimeChange = (militaryTime) => {
    setStarttime(militaryTime);
};

const handleMilitaryTimeChange2 = (militaryTime) => {
    setEndtime(militaryTime);
};

  useEffect(() => {
    axios.get('https://classscheeduling.pythonanywhere.com/get_timeslot_json/')
      .then(response => {
        const timeslotData = response.data;
        if (timeslotData) {
          // Find the room based on selectedCourseAbbreviation, selectedType, and selectedRoom
          const foundTimeslot = timeslotData.find(timeslot => 
            timeslot.college === selectedCourseAbbreviation &&
            timeslot.timeslottype === selectedType &&
            timeslot.timeslotID === selectedTime &&
            timeslot.starttime === selectedStarttime && 
            timeslot.endtime === selectedEndtime
          );

          if (foundTimeslot) {
            setStarttime(foundTimeslot.starttime);
            setEndtime(foundTimeslot.endtime);
          }
        }
      })
      .catch(error => console.log(error));
  }, [selectedCourseAbbreviation, selectedType, selectedTime, selectedStarttime, selectedEndtime]);


  const [timeslotData, setTimeslotData] = useState([]);

    useEffect(() => {
      // Fetch data from the API
      fetch('https://classscheeduling.pythonanywhere.com/get_timeslot_json/')
        .then(response => response.json())
        .then(data => {
          // Filter the data based on the selected college
          const filteredTimeslot = data.filter(timeslot => timeslot.college === parseInt(selectedCourseAbbreviation));
          // Sort the filteredTimeslot array based on starttime (earliest timeslot first)
          
          filteredTimeslot.sort((a, b) => a.starttime.localeCompare(b.starttime));
          setTimeslotData(filteredTimeslot);
        })
        .catch(error => console.log(error));
    }, [selectedCourseAbbreviation]);

  const handleFormSubmit = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    if (!starttime || !endtime) {
      setError('All fields are required to fill in.');
      return;
    }else if (starttime >= endtime){
      setError('Invalid Time Range');
      return;
    }

    const toMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // eslint-disable-next-line
    const bufferMinutes = 1;

    // Check if the new timeslot overlaps with existing timeslots
    const isOverlap = timeslotData.some(existingTimeslot => {
      const condition1 = starttime >= existingTimeslot.starttime && ((toMinutes(starttime) < toMinutes(existingTimeslot.endtime)) && starttime !== existingTimeslot.endtime);
      const condition2 = endtime > existingTimeslot.starttime && endtime < existingTimeslot.endtime;
      const condition3 = starttime <= existingTimeslot.starttime && endtime >= existingTimeslot.endtime;
    
      if (condition1 || condition2 || condition3) {
        if (condition1)
        if (condition2) 
        if (condition3);
        
      }
    
      return condition1 || condition2 || condition3;
    });

    if (isOverlap) {
      setError('Cannot insert between an existing time range.');
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('starttime', starttime);
    formData.append('endtime', endtime);
    formData.append('timeslottype', selectedType);

    // Send the updated room data to the Django backend using PUT method
    axios
      .post(`https://classscheeduling.pythonanywhere.com/update_timeslot/${selectedCourseAbbreviation}/${selectedTime}/`, formData)
      .then((response) => {
        console.log(response.data);
        window.location.reload();
        // Handle the response or perform any additional actions
        props.setShowUpdate(false); // Close the update room form
        navigate(`/${selectedCourse}`);
        
      })
      .catch((error) => {
        // Handle error response
        
      });
  };

  // Utility function to convert time from 24-hour format to 12-hour format
  const formatTimeTo12Hour = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let formattedHours = parseInt(hours, 10);

    if (formattedHours >= 12) {
      period = 'PM';
      formattedHours = formattedHours === 12 ? formattedHours : formattedHours - 12;
    }

    formattedHours = formattedHours === 0 ? 12 : formattedHours;

    return `${formattedHours}:${minutes} ${period}`;
  };


  return (
     <div style={{
      backgroundColor: 'white',
      position: 'absolute',
      left: position.x + 'px',
      top: position.y + 'px',
      height: '300px',
      width: '400px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10px',
      border: '1px solid black',
      zIndex: '999',
      cursor: isDragging ? 'grabbing' : 'grab',
    }}
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
    >

      <div style={{
      backgroundColor: '#060E57', 
      height: '20px',
      width: '400px', 
      position: 'absolute',
      left:'0',
      top: '0%', 
      borderTopRightRadius:'8px',
      borderTopLeftRadius:'8px',
      padding: '20px',
      }}>
        <h2 style={{ marginTop: '-2px',color:'white'}}>Update Timeslot ({selectedType})</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '437.5px', 
      position: 'absolute',
      left:'0.4%',
      top: '98%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      // padding: '20px',
      }}/>
      <h3 style={{ marginTop: '50px' }}>Start Time: </h3>
      <TimePicker onMilitaryTimeChange={handleMilitaryTimeChange} militaryTimeProp={formatTimeTo12Hour(selectedStarttime)} />

      <h3 style={{ marginTop: '12px' }}>End Time:</h3>
      <TimePicker onMilitaryTimeChange={handleMilitaryTimeChange2} militaryTimeProp={formatTimeTo12Hour(selectedEndtime)} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={handleFormSubmit}>Update</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: ' pointer' }} onClick={() => props.setShowUpdateTimeslot(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdateTimeslot;

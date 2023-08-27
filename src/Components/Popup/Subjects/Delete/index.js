import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DeleteSubject = (props) => {
  const selectedCourseAbbreviation = useSelector(state => state.auth.course);
  const selectedYear = useSelector(state => state.auth.year);
  const selectedSubject = useSelector(state => state.auth.subject);
  const [subjectData, setSubjectData] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/get_subject_json/')
      .then(response => {
        const subjectData = response.data;
        if (subjectData) {
          // Find the room based on selectedCourseAbbreviation and selectedRoom
          const foundSubject = subjectData.find(subject => 
            subject.course === selectedCourseAbbreviation &&
            subject.year === selectedYear &&
            subject.subjectID === selectedSubject
          );

          if (foundSubject) {
            setSubjectData(foundSubject);
          }
        }
      })
  }, [selectedCourseAbbreviation, selectedYear, selectedSubject]);

  const handleDelete = () => {
    // Check if roomData is available before proceeding with the delete request
    if (!subjectData) {
      console.error('Room data not available.');
      return;
    }

    // Send the DELETE request to delete the room with the specified course abbreviation and room name
    axios.delete(`http://127.0.0.1:8000/delete_subject/${selectedCourseAbbreviation}/${selectedSubject}/`)
      .then((response) => {
        // Handle the response or perform any additional actions
        props.setShowDeleteSubject(false); // Close the delete room form
        window.location.reload(); // Refresh the page after deleting the room
      })
      .catch((error) => {
        // Handle error response
        console.error(error);
      });
  };


  return (
    <div style={{
      backgroundColor: 'white',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      height: '200px',
      width: '350px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: '10px',
      border: '1px solid black',
    }}>
      <div style={{
      backgroundColor: '#060E57', 
      height: '20px',
      width: '350px', 
      position: 'absolute',
      left:'0',
      top: '0%', 
      borderTopRightRadius:'8px',
      borderTopLeftRadius:'8px',
      padding: '20px',
      }}>
         <h2 style={{marginTop:'-2px',color:'white'}}>Delete Subject</h2>
      </div>

      <div style={{
      backgroundColor: '#FAB417', 
      height: '7px',
      width: '387.8px', 
      position: 'absolute',
      left:'0.4%',
      top: '97.2%', 
      borderBottomRightRadius:'8px',
      borderBottomLeftRadius:'8px',
      // padding: '20px',
      }}/>

      {subjectData ? (
        <div style={{marginTop: '10px', textAlign: 'center'}}>
          <h3>Are you sure you want to delete?</h3>
          <span style={{fontSize: '15px'}}>Subject Code : {subjectData.subjectcode}</span>
          <br />
          <span style={{fontSize: '15px'}}>Subject Name: {subjectData.subjectname}</span>
          {/* Display other room details as needed */}
        </div>
      ) : (
        <div>
          <h3>Loading room data...</h3>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: '30px' }}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px', cursor: 'pointer'}} onClick={handleDelete}>Yes</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10%', marginTop: '-15px', cursor: 'pointer' }} onClick={() => props.setShowDeleteSubject(false)}>No</button>
      </div>
    </div>
  );
}

export default DeleteSubject;

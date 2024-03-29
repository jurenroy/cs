import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AddSubject = (props) => {
  const [error, setError] = useState('');

  const selectedCourse = useSelector(state => state.auth.course);
    const selectedYear = useSelector(state => state.auth.year)
    const selectedSemester = useSelector(state => state.auth.semester)
    const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [course, setCourse] = useState('');
    const [coursename, setCoursename] = useState('');

    const [subjectList, setSubjectList] = useState([]);
    const [selectedSubjectCode, setSelectedSubjectCode] = useState('');
    const [selectedSubjectName, setSelectedSubjectName] = useState('');

    const [hagas, setHagas] = useState('');

    useEffect(() => {
      const fetchData = async () => {
        setHagas(" (Loading!)")
        try {
          // Fetch courses
          const courseResponse = await axios.get('https://classscheeduling.pythonanywhere.com/get_course_json/');
          const courseData = courseResponse.data;
    
          // Find the selected course
          const filteredCourse = courseData.find((course) => course.courseID === selectedCourse);
    
          // Set coursename
          setCoursename(filteredCourse.coursename);
    
          // Fetch courselist using coursename
          const courselistResponse = await axios.get('https://classscheeduling.pythonanywhere.com/get_courselist_json/');
          const courselistData = courselistResponse.data;
    
          // Find the courselist based on coursename
          const filteredCourselist = courselistData.find((course) => course.coursename === coursename);
    
          if (filteredCourselist) {
            // Set course state with the filtered courselist
            setCourse(filteredCourselist);
    
            // Fetch all subjects
            const allSubjectsResponse = await axios.get('https://classscheeduling.pythonanywhere.com/get_subjectlist_json/');
            const allSubjectsData = allSubjectsResponse.data;
    
            // Filter subjects based on course, year, and semester
            const filteredSubjects = allSubjectsData.filter(
              (subject) =>
                subject.course === filteredCourselist.courselistID &&
                subject.year === selectedYear &&
                subject.semester === selectedSemester
            );
    
            // Fetch existing subjects
            const existingSubjectsResponse = await axios.get('https://classscheeduling.pythonanywhere.com/get_subject_json/', {
              params: {
                course: filteredCourselist.courselistID,
                year: selectedYear,
                semester: selectedSemester,
              },
            });
            const existingSubjectsData = existingSubjectsResponse.data;
    
            // Subtract existing subjects from the filtered subjects
            const newSubjects = filteredSubjects.filter(
              (subject) =>
                !existingSubjectsData.some(
                  (existingSubject) => existingSubject.subjectcode === subject.subjectcode && existingSubject.subjectname === subject.subjectname
                )
            );
    
            // Set subject list state
            setSubjectList(newSubjects);
            setHagas("")
          } else {
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }, [selectedCourse, coursename, selectedYear, selectedSemester]);
    

    // Handle subject code change
const handleSubjectCodeChange = e => {
  const selectedCode = e.target.value;
  setSelectedSubjectCode(selectedCode);

  // Find the subject with the selected code and set the corresponding name
  const selectedSubject = subjectList.find(subject => subject.subjectcode === selectedCode);
  if (selectedSubject) {
    setSelectedSubjectName(selectedSubject.subjectname);
  } else {
    setSelectedSubjectName('');
  }
};

// Handle subject name change
const handleSubjectNameChange = e => {
  const selectedName = e.target.value;
  setSelectedSubjectName(selectedName);

  // Find the subject with the selected name and set the corresponding code
  const selectedSubject = subjectList.find(subject => subject.subjectname === selectedName);
  if (selectedSubject) {
    setSelectedSubjectCode(selectedSubject.subjectcode);
  } else {
    setSelectedSubjectCode('');
  }
};
    


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

  const handleAddSubject = () => {
    setError(''); // Clear any previous errors

    // Perform form validation (check if fields are not empty)
    if (selectedSubjectCode.trim() === '' && selectedSubjectName.trim() === '' ) {
      setError('All fields are required to fill in.');
    
    }else if (selectedSubjectCode.trim() === ''|| !selectedCourse || !selectedYear ) {
      setError('Please input a valid Subject Code');
    
    }else if (selectedSubjectName.trim() === ''|| !selectedCourse || !selectedYear) {
        setError('Please input a valid Subject Name');

    }else{
      setButtonDisabled(true); // Disable the button
      setLoading(true);

    // Create FormData object
    const formData = new FormData();
    formData.append('subjectcode', selectedSubjectCode);
    formData.append('subjectname', selectedSubjectName);
    formData.append('year', selectedYear);

    // Send the room data to the Django backend
    axios
      .post(`https://classscheeduling.pythonanywhere.com/add_subject/${selectedCourse}/`, formData)
      .then((response) => {
        props.setShowAddSubject(false); // Close the add room form
        window.location.reload();
      })
      .catch((error) => {
        // Handle error response
        if (error.response) {
          setError(error.response.data.message || 'An error occurred.');
        } else {
          setError('An error occurred.');
        }
      })
      .finally(() => {
        setButtonDisabled(false); // Re-enable the button after request completion
        setLoading(false); 
      });
    }
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
      border: '1px solid black',
      borderRadius: '10px',
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
         {hagas ? (
        <h2 style={{ marginTop: '-2px', color: 'red' }}>Add Subject {hagas}</h2>
      ) : (
        <h2 style={{ marginTop: '-2px', color: 'white' }}>Add Subject </h2>
      )}
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
      }}/>
      <div>
  <h3 style={{ marginTop: '50px' }}>Subject Code:</h3>
  <select
    style={{ height: '40px', borderRadius: '10px', fontSize: '20px', width: '100%' }}
    value={selectedSubjectCode}
    onChange={handleSubjectCodeChange}
    required
  >
    <option value="" disabled>
      Select a subject code
    </option>
    {subjectList.map(subject => (
      <option key={subject.subjectlistID} value={subject.subjectcode}>
        {subject.subjectcode}
      </option>
    ))}
  </select>
</div>

<div>
  <h3 style={{ marginTop: '12px' }}>Subject Name:</h3>
  <select
    style={{ height: '40px', borderRadius: '10px', fontSize: '20px', width: '100%' }}
    value={selectedSubjectName}
    onChange={handleSubjectNameChange}
    required
  >
    <option value="" disabled>
      Select a subject name
    </option>
    {subjectList.map(subject => (
      <option key={subject.subjectlistID} value={subject.subjectname}>
        {subject.subjectname}
      </option>
    ))}
  </select>
</div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{display:'flex',flexDirection:'row', justifyContent:'space-evenly', marginTop:'30px'}}>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={handleAddSubject} disabled={isButtonDisabled} // Disable the button based on state
      >
        {isLoading ? 'Adding...' : 'Add'}</button>
        <button style={{ height: '35px', width: '30%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => props.setShowAddSubject(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default AddSubject;

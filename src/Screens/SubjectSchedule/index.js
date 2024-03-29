import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Navbar from '../../Components/Navigation';
import Sidebar from '../../Components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import editicon from '../../Assets/edit1.png';
import { selectCourse, selectSchedule, selectYear } from '../../Components/Redux/Auth/AuthSlice';
import UpdateSchedule from '../../Components/Popup/Schedule/Update';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ClearScheduleComponent from '../../Components/Popup/Schedule/Clear';

function SubjectSchedule() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { subject_name } = useParams();
  const [scheduleData, setScheduleData] = useState([]);
  const isAdmin = useSelector(state => state.auth.isAdmin);
  const selectedCourse = useSelector(state => state.auth.course);
  const selectedCollege = useSelector(state => state.auth.college);
  const [showUpdateSchedule, setShowUpdateSchedule] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const [instructors, setInstructors] = useState([]);

  const [selectedFilterCourse, setSelectedFilterCourse] = useState('');
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    // Fetch instructor data from the API
    axios
      .get('https://classscheeduling.pythonanywhere.com/get_instructor_json/')
      .then((response) => {
        // Filter instructors by college
        const filteredInstructors = response.data.filter((instructor) => instructor.college === parseInt(selectedCollege));
        setInstructors(filteredInstructors); // Store the filtered instructor names in state
      })
      .catch((error) => {
        console.error('Error fetching instructor data:', error);
      });
  }, [selectedCollege]);

  useEffect(() => {
    // Check if the user is logged in and navigate accordingly
    if (!isLoggedIn) {
      navigate('/'); // Redirect to the '/' route
    }
  }, [isLoggedIn, navigate]);

// Fetch course data based on selectedCollege
async function fetchCourseData(selectedCollege) {
    try {
      const response = await fetch('https://classscheeduling.pythonanywhere.com/get_course_json/');
      const data = await response.json();
  
      // Filter the data based on selectedCollege
      const filteredData = data.filter(course => course.college === parseInt(selectedCollege));
      setCourseList(filteredData)
  
      return filteredData;
    } catch (error) {
      return [];
    }
  }  

  const handleFilterChange = (e) => {
    setSelectedFilterCourse(e.target.value);
  };
  
  // Fetch schedule data and add course abbreviation
  // Fetch schedule data and add course abbreviation
  // eslint-disable-next-line
  async function fetchScheduleData() {
    try {
      const scheduleResponse = await fetch('https://classscheeduling.pythonanywhere.com/get_schedule_json/').then((response) =>
        response.json()
      );
  
  
      // Extract courseIDs from scheduleResponse
      const courseIDs = scheduleResponse.map((schedule) => schedule.course);
  
      // Fetch course data based on selectedCollege and courseIDs
      const courseData = await fetchCourseData(selectedCollege, courseIDs);
  
      // Filter data based on selectedCourse, selectedYear, and selectedSection
      const filteredData = scheduleResponse.filter((schedule) => schedule.subject_name === subject_name);
  
      // Add course abbreviation to each schedule
      const schedulesWithAbbreviation = filteredData
        .map((schedule) => {
          const matchingCourse = courseData.find((course) => course.courseID === schedule.course);
          const abbreviation = matchingCourse ? matchingCourse.abbreviation : null;
  
          return {
            ...schedule,
            abbreviation,
          };
        })
        .filter((schedule) => schedule.abbreviation !== null); // Filter out schedules without abbreviation
  
      setScheduleData(schedulesWithAbbreviation);
    } catch (error) {
    }
  }
  

  useEffect(() => {
    if (location.pathname === `/subject/${subject_name}`) {
      dispatch(selectCourse(''));
      dispatch(selectYear(''));
    }
  }, [dispatch, location.pathname, subject_name]);


  const handleCancelClickSchedule = (schedule) => {
    setShowUpdateSchedule(prevShow => !prevShow);
    dispatch(selectSchedule(schedule.scheduleID));
  }

  useEffect(() => {
    fetchScheduleData();
    // eslint-disable-next-line
  }, [subject_name, selectedCourse, fetchScheduleData]);

  


  // Define a function to fetch schedule data for the search bar
async function fetchScheduleDataForSearch(searchQuery) {
  try {
    // Fetch the schedule data (you can customize the URL as needed)
    const response = await fetch('https://classscheeduling.pythonanywhere.com/get_schedule_json/');
    const data = await response.json();
    const courseData = await fetchCourseData(selectedCollege);

    // Filter data to keep only schedules whose course ID exists in courseData
    const filteredData = data.filter((schedule) => {
      return courseData.some((course) => course.courseID === schedule.course);
    });

    return filteredData;
  } catch (error) {
       return [];
  }
}
  
  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);
  
    if (input.trim() !== '') {
      // Fetch schedule data based on the non-empty search input
      fetchScheduleDataForSearch(input)
        .then((data) => {
          // Create an array to store unique instructor names
          const uniqueSubject_name = [];
  
          // Filter the data based on the instructor name and add to the uniqueSubject_name array
          data.forEach((schedule) => {
            const subject_name = schedule.subject_name;
            if (subject_name.includes(input) && !uniqueSubject_name.includes(subject_name)) {
              uniqueSubject_name.push(subject_name);
            }
          });
  
          // Process the unique results as needed
          setSearchResults(uniqueSubject_name);
        })
        .catch((error) => {
        });
    } else {
      // Clear the search results when the input is empty
      setSearchResults([]);
    }
  };

  const handleSubjectClick = (subject_name) => {
    // Change the route when an instructor is clicked
    navigate(`/subject/${subject_name}`);
  };

  const formattedTime = (timeString) => {
    const timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
  
    const formattedTime = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  
    return formattedTime;
  };
  

  return (
    <div style={{ backgroundColor: '#dcdee4', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ background: '#dcdee4', height: '115px', position: 'fixed', top: '0', left: '0', right: '0', zIndex: '10' }}></div>
      <Navbar />
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '115px' }}>
        <Sidebar />
        <div style={{ flex: '1', backgroundColor: 'white', marginLeft: '1%', marginRight: '1%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <h2 style={{ textAlign: 'center' }}>Schedule for Subject: {subject_name}</h2>
            <div>
        <label htmlFor="courseFilter">Filter by Course:</label>
        <select id="courseFilter" value={selectedFilterCourse} onChange={handleFilterChange}>
          <option value="">All Courses</option>
          {courseList.map((course) => (
            <option key={course.courseID} value={course.abbreviation}>
              {course.abbreviation}
            </option>
          ))}
        </select>
      </div>

            <div>
              <input
                type="text"
                placeholder="Search Subjects"
                value={searchInput}
                onChange={handleSearchInputChange}
              />
              <ul>
                {searchResults.map((subject_name, index) => (
                  <li
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                    key={index} // Use index as the key since instructor names don't have unique IDs
                    onClick={() => handleSubjectClick(subject_name)}
                  >
                    {subject_name}
                  </li>
                ))}
              </ul>
            </div>

            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Instructor</th>
                  <th>Lecture Schedule</th>
                  <th>Laboratory Schedule</th>
                  <th>Conflict</th>
                  {!isAdmin && (
                  <th>Action</th>)}
                </tr>
              </thead>
              <tbody>
                {scheduleData
                  .filter((schedule) => !selectedFilterCourse || schedule.abbreviation === selectedFilterCourse)
                  .map((schedule) => {
                    let yearValue = '1';
                    if (schedule.section_year === 'Second Year') {
                      yearValue = '2';
                    } else if (schedule.section_year === 'Third Year') {
                      yearValue = '3';
                    } else if (schedule.section_year === 'Fourth Year') {
                      yearValue = '4';
                    }
                  
                    const isConflict = schedule.lecture_day === schedule.lab_day && schedule.lecture_day && schedule.lab_day;
                  
                    // Parse the start and end times into Date objects
                    const lectureStartTime = new Date(`1970-01-01T${schedule.lecture_starttime}`);
                    const lectureEndTime = new Date(`1970-01-01T${schedule.lecture_endtime}`);
                    const labStartTime = new Date(`1970-01-01T${schedule.lab_starttime}`);
                    const labEndTime = new Date(`1970-01-01T${schedule.lab_endtime}`);

                    // Check if there is a time overlap
                    const isTimeConflict = isConflict && lectureStartTime < labEndTime && lectureEndTime > labStartTime;

                    return (
                      <tr key={schedule.scheduleID}>
                        <td>{schedule.abbreviation}{yearValue}S{schedule.section_number}</td>
                        <td>{schedule.subject_code} - {schedule.subject_name}</td>
                        <td>
                          <p
                            style={{ textDecoration: 'underline', cursor: 'pointer', fontStyle: 'italic', fontWeight: 'bold' }}
                            onClick={() => {
                              navigate(`/instructor/${schedule.instructor}`);
                            }}
                          >
                            {instructors.find((instructor) => parseInt(instructor.instructorID) === parseInt(schedule.instructor))?.name ||
                              'Not Assigned'}
                          </p>
                        </td>
                        <td>
                          {schedule.lecture_day}:{schedule.lecture_building_number}-{schedule.lecture_roomname}[
                          {formattedTime(schedule.lecture_starttime)}-{formattedTime(schedule.lecture_endtime)}]
                            {schedule.lecture_day && schedule.lecture_building_number && schedule.lecture_roomname ?
                  <ClearScheduleComponent selectedSchedule={schedule.scheduleID} selectedType="Lecture"/>:
                  null }
                        </td>
                        <td>
                          {schedule.lab_day}:{schedule.lab_building_number}-{schedule.lab_roomname}[
                          {formattedTime(schedule.lab_starttime)}-{formattedTime(schedule.lab_endtime)}]
                          {schedule.lab_day && schedule.lab_building_number && schedule.lab_roomname ?
                  <ClearScheduleComponent selectedSchedule={schedule.scheduleID} selectedType="Laboratory"/> :
                  null }
                        </td>
                        <td>
                          {isConflict && <p style={{ color: 'red' }}>Lecture and Lab on the same day</p>}
                          {isTimeConflict && <p style={{ color: 'red' }}>Time Conflict</p>}
                          {!isConflict && !isTimeConflict && <p>No conflict</p>}
                        </td>

                        {!isAdmin && (
                          <td>
                              <div style={{top:'-2px',position:'relative',flex:'1',display:'flex',flexDirection:'row'}}>
                    <label style={{fontWeight:'bold',fontSize:'15px',position:'relative',left:'10px'}}>
                      Edit
                    </label>

                    </div>
                            <img
                              src={editicon}
                              alt="edit icon"
                              style={{width: '23px', height: '23px', marginLeft: '10px', cursor: 'pointer' }}
                              onClick={() => {
                                handleCancelClickSchedule(schedule);
                              }}
                              title='Edit Schedule'
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>

            </table>
            {showUpdateSchedule ? <UpdateSchedule setShowUpdateSchedule={setShowUpdateSchedule} handleCancelClickSchedule={handleCancelClickSchedule} /> : null}
          </div>
        </div>
      </div>
      <footer style={{ backgroundColor: 'lightgray', padding: '5px', textAlign: 'center', height: '15px' }}>
        <p style={{ marginTop: '-5px' }}>Team Kokkak</p>
      </footer>
    </div>
  );
}

export default SubjectSchedule;

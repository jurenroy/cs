import { createSlice } from '@reduxjs/toolkit';

const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    username: '',
    course: '', // New state for the selected course
    year: '', // New state for the selected year
    isAdmin: false, // New state for isAdmin
    college: '', // New state for college
    type: '',
    room: '',
    starttime: '',
    endtime: '',
    subject: '',
    sectionnumber: '',
    
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.username = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.username = '';
    },
    selectCourse: (state, action) => {
      state.course = action.payload;
    },
    selectYear: (state, action) => {
      state.year = action.payload;
    },
    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    setCollege: (state, action) => {
      state.college = action.payload;
    },
    selectType: (state, action) => {
      state.type = action.payload;
    },
    selectRoom: (state, action) => {
      state.room = action.payload;
    },
    selectTime: (state, action) => {
      const { starttime, endtime } = action.payload;
      state.starttime = starttime;
      state.endtime = endtime;
    }, //dispatch(selectTime({ starttime: 'timeslot.starttime', endtime: 'timeslot.endtime' })); just like how we get rooms hehehe
    selectSubject: (state, action) => {
      state.subject = action.payload;
    },
    selectSection: (state, action) => {
      state.sectionnumber = action.payload;
    },
  },
});

export const { login, logout, selectCourse, selectYear, setAdmin, setCollege, selectType, selectRoom, selectTime, selectSubject, selectSection } = AuthSlice.actions;

export default AuthSlice.reducer;
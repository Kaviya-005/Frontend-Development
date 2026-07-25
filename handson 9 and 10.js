import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use(config => {
  config.headers.Authorization = "Bearer mock_token_123";
  return config;
});

apiClient.interceptors.response.use(
  response => response.data,
  error => {
    throw {
      message: error.message,
      statusCode: error.response?.status
    };
  }
);

export default apiClient;



import apiClient from "./apiClient";

export const getAllCourses = () =>
  apiClient.get("/posts");

export const getCourseById = (id) =>
  apiClient.get(`/posts/${id}`);

export const enrollStudent = (studentId, courseId) =>
  apiClient.post("/enroll", {
    studentId,
    courseId
  });



  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCourses } from "../api/courseApi";

export const fetchAllCourses = createAsyncThunk(
  "courses/fetchAll",
  async () => {
    return await getAllCourses();
  }
);

const courseSlice = createSlice({
  name: "courses",

  initialState: {
    courses: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: builder => {

    builder.addCase(fetchAllCourses.pending, state => {
      state.loading = true;
    });

    builder.addCase(fetchAllCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    });

    builder.addCase(fetchAllCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

  }

});

export default courseSlice.reducer;




export const selectCourses =
state => state.courses.courses;

export const selectCoursesLoading =
state => state.courses.loading;

export const selectCoursesError =
state => state.courses.error;




import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
fetchAllCourses,
selectCourses,
selectCoursesLoading,
selectCoursesError
} from "./courseSlice";

function CoursesPage(){

const dispatch = useDispatch();

const courses = useSelector(selectCourses);

const loading = useSelector(selectCoursesLoading);

const error = useSelector(selectCoursesError);

useEffect(()=>{

dispatch(fetchAllCourses());

},[]);

if(loading) return <h2>Loading...</h2>;

if(error) return <h2>{error}</h2>;

return(

courses.map(course=>

<div key={course.id}>
{course.title}
</div>

)

);

}

export default CoursesPage;




import React from "react";

class ErrorBoundary extends React.Component{

state={
hasError:false
};

static getDerivedStateFromError(){

return{
hasError:true
};

}

componentDidCatch(error){

console.log(error);

}

render(){

if(this.state.hasError){

return <h2>Something went wrong.</h2>;

}

return this.props.children;

}

}

export default ErrorBoundary;



<ErrorBoundary>
<App />
</ErrorBoundary>
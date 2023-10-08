import React, { useCallback, useEffect, useState } from 'react'
import {LiaUsersSolid} from 'react-icons/lia'
import {GiWhiteBook} from 'react-icons/gi'
import { PiStudentBold } from 'react-icons/pi'
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from 'config/firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
// import ChartComponent from 'components/ChartComponent'
// const Count = collection(firestore, "students");
export default function Hero() {
 const [studentCount, setStudentCount] = useState(0);
  const q = query(collection(firestore, 'students'));

  const numberOfStudents = useCallback(async () => {
    try {
      const snapshot = await getDocs(q);

      // Get the number of documents in the snapshot
      const numberOfDocuments = snapshot.size;

      // Set the total count in the state
      setStudentCount(numberOfDocuments);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }, [q]);

  useEffect(() => {
    numberOfStudents();
  }, [numberOfStudents]);
   const [courseCount, setCourseCount] = useState(0);
  const q2 = query(collection(firestore, 'courses'));

  const numberOfCourses = useCallback(async () => {
    try {
      const snapshot = await getDocs(q2);

      // Get the number of documents in the snapshot
      const numberOfDocuments = snapshot.size;

      // Set the total count in the state
      setCourseCount(numberOfDocuments);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }, [q2]);

  useEffect(() => {
    numberOfCourses();
  }, [numberOfCourses]);
  const data = [
    { name: "G1", value: 200 },
    { name: "G2", value: 400 },
    { name: "G3", value: 100 },
    { name: "G4", value: 700 },
    { name: "G5", value: 400 },
    { name: "G6", value: 500 },
    { name: "G7", value: 300 },
    { name: "G8", value: 100 },
    // { name: documents.length, value: 200 },

  ]
  return (
    <>
    <div>
        <ul className="row px-0">
            <li
              className="col-12 col-md-6 col-lg-4"
              style={{ listStyleType: 'none' }}
             
            >
              <div
                className="stick"
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  height: '150px',
                }}
              >
   <div className='rounded-3 p-3' style={{backgroundColor: "white",color:'#E46A8F',boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px'}}>
            <h3 className='d-flex align-items-center justify-content-between'>Students <PiStudentBold /></h3>
            <p>{studentCount}</p>
        </div>

              </div>
            </li>
            <li
              className="col-12 col-md-6 col-lg-4"
              style={{ listStyleType: 'none' }}
             
            >
              <div
                className="stick"
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  height: '150px',
                }}
              >
<div className='rounded-3 p-3' style={{backgroundColor: "white",color: '#69D8AB',boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px'}}>
            <h3 className='d-flex align-items-center justify-content-between'>Courses <GiWhiteBook /></h3>
            <p>{courseCount}</p>
        </div>
              </div>
            </li>
            <li
              className="col-12 col-md-6 col-lg-4"
              style={{ listStyleType: 'none' }}
             
            >
              <div
                className="stick"
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  height: '150px',
                }}
              >
                
<div className='rounded-3 p-3' style={{backgroundColor: "white",color: '#7A99E2',boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px'}}>
            <h3 className='d-flex align-items-center justify-content-between'>Attendance <LiaUsersSolid /></h3>
            <p>4%</p>
        </div>
              </div>
            </li>
          </ul>
    </div>
    <div>
    <div className="container mt-5">
        <div className="row">
          <div className="col">
            <LineChart
              width={900}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

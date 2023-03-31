import React, { useState, useEffect,useContext } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DatePickerProps } from "antd";
import { DatePicker, Space, Select, Radio, Tabs, RadioChangeEvent } from "antd";
// import { Select, Space } from 'antd';
import Menu from "./Menu";
import Navbar from "./Navbar";
// import EmployeeTable from "./EmployeeTable";
import MorningTaskTable from "./MorningTaskTable";
import DashboardTable from "./DashboardTable";
import axios from "axios";
import { format } from "date-fns";
import { GlobalInfo } from "../App";


type TabPosition = "morning" | "evening";

interface Employee {
  EmpID: number;
  firstName: string;
  role: string;
  dob: Date;
}

interface Task {
  MrngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: number;
  employeeID: string;
  currDate: string;
}


// const data: Employee[][] = [
//   [
//     { EmpID: 1, firstName: 'Alice', role: 'Manager', dob: new Date(1996, 1, 1) },
//     { EmpID: 2, firstName: 'Bob', role: 'Developer', dob: new Date(1991, 2, 2) },
//     { EmpID: 3, firstName: 'Charlie', role: 'Designer', dob: new Date(1986, 3, 3) },
//   ],
//   [
//     { EmpID: 4, firstName: 'Dave', role: 'Developer', dob: new Date(1981, 4, 4) },
//     { EmpID: 5, firstName: 'Eve', role: 'Designer', dob: new Date(1976, 5, 5) },
//   ],
//   [
//     { EmpID: 6, firstName: 'Frank', role: 'Manager', dob: new Date(1971, 6, 6) },
//   ]
// ];

const ViewMorningTask: React.FC = () => {
  const [mode, setMode] = useState<TabPosition>("morning");
  const [data, setData] = useState<any>();
  const [employeeID, setEmployeeID] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const[editID , setEditID] = useState<any>()


  const { getEmpInfo , empInfo,  setEmpInfo ,setMrngEditID  } = useContext(GlobalInfo);


  if(editID){
    setMrngEditID(editID)
  }

  console.log(editID,"jjjllllll----");


  const formattedDate = format(currentDate, "yyyy-MM-dd");

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  useEffect(() => {
    axios
      .get<Task[]>("http://localhost:5000/get/addTaskMorning")
      .then((response) => {
        const res = response.data.filter(
          (e) => e.employeeID === employeeID && e.currDate === formattedDate
        );
        // setData(res);

        // setData(response.data);

        // sort the data array in reverse order based on ProID
        const sortedData = res.sort((a, b) => Number(b.MrngTaskID) - Number(a.MrngTaskID));
        setData(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [employeeID]);

  const dataString = localStorage.getItem("myData");

  // Parse the JSON string back into an array
  const employeeInfo = dataString ? JSON.parse(dataString) : [];
  useEffect(() => {
    setEmployeeID(employeeInfo[0].EmployeeID);
  }, [employeeInfo[0].EmployeeID]);

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          // maxHeight:'90%'
        }}
      >
        <div style={{ height: "8%" }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            className="form-container"
          >
            <div
              style={{
                display: "flex",
                width: "80%",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {/* <DashboardTable /> */}
            </div>
            <div style={{ width: "90%", height: "80%", marginTop: "3%" }}>
            <div
              style={{
                display: "flex",
                width: "80%",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <p
                style={{
                  color: "#094781",
                  justifyContent: "flex-start",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
                Morning Tasks
              </p>
            </div>
                <MorningTaskTable data={data} editID={editID} setEditID={setEditID} />
              </div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default ViewMorningTask;

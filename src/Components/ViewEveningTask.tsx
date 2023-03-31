import React, { useState, useEffect ,useContext} from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DatePickerProps } from "antd";
import { DatePicker, Space, Select, Radio, Tabs, RadioChangeEvent } from "antd";
// import { Select, Space } from 'antd';
import Menu from "./Menu";
import Navbar from "./Navbar";
// import EmployeeTable from "./EmployeeTable";
import EveningTaskTable from "./EveningTaskTable";
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
  EvngTaskID: number;
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

const ViewEveningTask: React.FC = () => {
  const [mode, setMode] = useState<TabPosition>("morning");
  const [data, setData] = useState<any>([]);
  const [employeeID, setEmployeeID] = useState<string>("");

  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const formattedDate = format(currentDate, "yyyy-MM-dd");

  const { evngEditID, setEvngEditID } = useContext(GlobalInfo);




  console.log(data, "tttttttttttppppttt----");

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  useEffect(() => {
    console.log("234567890234567890-");

    axios
      .get<Task[]>("http://localhost:5000/get/addTaskEvening")
      .then((response) => {
        // setData(response?.data.filter((e) => e.employeeID == employeeID   && e.currDate === formattedDate));
    const arr =    response?.data.filter((e) => e.employeeID == employeeID   && e.currDate === formattedDate)
        console.log(response.data ,"uuuuuuuuuuuuuupppppppppp");

        // sort the data array in reverse order based on ProID
        const sortedData = arr.sort((a, b) => Number(b.EvngTaskID) - Number(a.EvngTaskID));
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

  console.log(data, "uuuuuu");

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
                Evening Tasks
              </p>
            </div>
                <EveningTaskTable data={data}   evngEditID={evngEditID} setEvngEditID={setEvngEditID} />
              </div>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
};

export default ViewEveningTask;

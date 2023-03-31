import React, { useState,useEffect } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { DatePickerProps } from "antd";
import { DatePicker, Space ,Select,Radio, Tabs,RadioChangeEvent} from "antd";
// import { Select, Space } from 'antd';
import Menu from "./Menu";
import Navbar from "./Navbar";
// import EmployeeTable from "./EmployeeTable";
import DashboardTaskTable from "./DashboardTaskTable";
import DashboardTable from './DashboardTable'
import axios from "axios";



type TabPosition = 'morning' | 'evening';

interface Employee {
    EmpID: number;
    firstName: string;
    role: string;
    dob: Date;
  }

  interface Task {
    MrngTaskID : number;
    projectName: string;
    phaseName: string;
    module: string;
    task: string;
    estTime:  string;
    upWorkHrs:  number;
  }









const Dashboard: React.FC = () => {
    const [mode, setMode] = useState<TabPosition>('morning');
    const [data, setData] = useState<any>([]);
    console.log(data,"tttttttttttppppttt----");


    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
      };

      const handleModeChange = (e: RadioChangeEvent) => {
        setMode(e.target.value);
      };

      useEffect(() => {
        console.log("234567890234567890-");

        axios
          .get<Task[]>("http://localhost:5000/get/addTaskMorning")
          .then((response) => {
            setData(response.data);

            // sort the data array in reverse order based on ProID
            // const sortedData = response.data.sort((a, b) => Number(b.MrngTaskID) - Number(a.MrngTaskID));
            // setData(sortedData);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }, []);



      console.log(data,"uuuuuu");

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
        <div style={{ height: "8%",

    }}>
          <Navbar />
        </div>
        <div style={{ display: "flex", flexDirection: "row", height: "90%" }}>
          <div className="menu-div">
            <Menu />
          </div>
          <div style={{display:'flex',flexDirection:'column', }}
           className="form-container"
           >
            <div style={{display:'flex', width:'80%',alignItems:'center',justifyContent:'flex-start',}}>


                {/* <DashboardTable /> */}
            </div>
            <div style={{width:'90%',height:'80%',marginTop:'3%',}}>
            <div style={{   }} >
                {/* <DashboardTaskTable  data={data} /> */}

            </div>
            </div>
          </div>
        </div>
      </div>
     </div>
  );
};

export default Dashboard;

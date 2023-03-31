import React,{createContext , useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./Components/Login";
// import AppMenu from "./Components/Menu";

import Dashboard from "./Components/Dashboard";

import TableNavbar from "./Components/TableNavbar";
import AddMorningTask from "./Components/AddMorningTask";
import AddEveningTask from "./Components/AddEveningTask";
import ViewMorningTask from "./Components/ViewMorningTask";
import ViewEveningTask from "./Components/ViewEveningTask";
// import MorningTaskTable from "./Components/MorningTaskTable";

export const GlobalInfo = createContext<any>({});



const App: React.FC = () => {
const [empInfo, setEmpInfo] = useState()
const [updatedempID, setupdatedEmpID] = useState('')
const [mrngEditID, setMrngEditID] = useState()
const [evngEditID, setEvngEditID] = useState()

console.log(mrngEditID,"lllll-pppppppllljjjjgggggg---");


const getEmpInfo =(item : any)=>{

console.log(item,"jjj-----jjj");

}





  return (
    <Router>
      {/* <AppMenu /> */}
<GlobalInfo.Provider   value={{empInfo : empInfo, setEmpInfo : setEmpInfo ,    getEmpInfo : getEmpInfo ,
   mrngEditID:mrngEditID ,setMrngEditID:setMrngEditID , evngEditID : evngEditID, setEvngEditID : setEvngEditID }}>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/table-navbar" element={<TableNavbar />} />
        <Route path="/add-morning-task" element={<AddMorningTask />} />
        <Route path="/add-evening-task" element={<AddEveningTask />} />
        <Route path="/view-morning-task" element={<ViewMorningTask />} />
        <Route path="/view-evening-task" element={<ViewEveningTask />} />
        {/* <Route path="/MorningTaskTable" element={<MorningTaskTable />} /> */}
        </Routes>

        </GlobalInfo.Provider>
    </Router>
  );
};

export default App;

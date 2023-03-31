import React, { useState, useEffect,useContext } from "react";

import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface Task {
  EvngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  actTime: string;
  upWorkHrs: number;
}

interface Props {
  data: Task[];
  evngEditID: number ;
  setEvngEditID: React.Dispatch<React.SetStateAction<number >>;

}
// interface Propsdata {
//   data: Task[];
// }



const EveningTaskTable: React.FC<Props> = ({ data ,evngEditID, setEvngEditID}) => {
  const [info, setInfo] = useState<Task[]>([]);
  const [propsData, setPropsData] = useState<any>();
  const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
  const [employeeLastname, setEmployeeLastname] = useState<string>("");


  const navigate = useNavigate();



  useEffect(() => {
    setPropsData(data);
  }, [data]);

  console.log(data,"34567890------");



  const handleEdit = (EvngTaskID: number) => {
    console.log(`Edit employee with id ${EvngTaskID}`);
    setEvngEditID(EvngTaskID)

navigate("/add-evening-task");

  };





    const handleDelete = (EvngTaskID: number) => {
      // console.log(`Delete task with id ${MrngTaskID}`);

      axios
        .delete(`http://localhost:5000/delete/eveningDashboard/${EvngTaskID}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
        setPropsData(propsData.filter((e: any) =>e.EvngTaskID!== EvngTaskID));
    };

    const dataString = localStorage.getItem("myData");

    // Parse the JSON string back into an array
    const employeeInfo = dataString ? JSON.parse(dataString) : [];
    console.log(employeeInfo, "ppp------------");

    useEffect(() => {
      // setEmployeeID(employeeInfo[0].EmployeeID)
      setEmployeeFirstname(employeeInfo[0].firstName);
      setEmployeeLastname(employeeInfo[0].lastName);

      console.log(employeeInfo[0].EmployeeID, "wwwwwwwwwwwwwwww");
    }, [employeeInfo[0].firstName]);



  console.log(data, "yyyyyyy");

  const columns = [
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
    },
    {
      title: "Phase",
      dataIndex: "phaseName",
      key: "phaseName",
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
    },
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
      //   render: (dob: string | Date) => new Date(dob).toLocaleDateString(),
    },
    {
      title: "Est time (hrs)",
      dataIndex: "estTime",
      key: "estTime",
    },
    {
      title: "Act time (hrs)",
      dataIndex: "actTime",
      key: "actTime",
    },
    {
      title: "UpWork(hrs)",
      dataIndex: "upWorkHrs",
      key: "upWorkHrs",
    },

    {
      title: "Action",
      key: "action",
      render: (_: any, record: Task) => (
        <span>
          <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.EvngTaskID)}
            >
              Edit
            </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.EvngTaskID)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>

<p>{employeeFirstname}{employeeLastname} </p>
      <Table
        dataSource={propsData}
        columns={columns}
        rowClassName={() => "header-row"}
      />
    </>
  );
};

export default EveningTaskTable;

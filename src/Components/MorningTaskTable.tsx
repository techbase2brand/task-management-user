import React, { useState, useEffect } from "react";

import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
  MrngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: number;
}

interface Props {
  data: Task[];
  editID: number ;
  setEditID: React.Dispatch<React.SetStateAction<number >>;

}
// interface Propsdata {
//   data: Task[];
// }



const MorningTaskTable: React.FC<Props> = ({ data ,editID, setEditID}) => {
  const [info, setInfo] = useState<Task[]>([]);
  const [propsData, setPropsData] = useState<any>();
  const [employeeFirstname, setEmployeeFirstname] = useState<string>("");
  const [employeeLastname, setEmployeeLastname] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    setPropsData(data);
  }, [data]);

  const handleEdit = (MrngTaskID:  number) => {
    console.log(`Edit employee with id ${MrngTaskID}`);

    setEditID(MrngTaskID)
    navigate("/add-morning-task");


  };





  const handleDelete = (MrngTaskID: number) => {
    // console.log(`Delete task with id ${MrngTaskID}`);

    axios
      .delete(`http://localhost:5000/delete/morningDashboard/${MrngTaskID}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setPropsData(propsData.filter((e: any) => e.MrngTaskID !== MrngTaskID));
  };

  const handleMove = (record: any) => {
    console.log(record, "6666666666--------");

    axios
      .post("http://localhost:5000/create/addTaskEvening", record)
      .then((response) => {
        if (response.data === "All fields are required.") {
          alert("All fields are required.");
        } else {
          handleDelete(record.MrngTaskID);

          // navigate("/dashboard");
        }

        console.log(response.data); // log the response message
        // show a success message to the user
      })
      .catch((error) => {
        console.log(error.response.data); // log the error message
        // show an error message to the user
      });
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
  // console.log(data, "yyyyyyy");

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
              onClick={() => handleEdit(record.MrngTaskID)}
            >
              Edit
            </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.MrngTaskID)}
          >
            Delete
          </Button>
          <Button onClick={() => handleMove(record)}>move</Button>
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

export default MorningTaskTable;

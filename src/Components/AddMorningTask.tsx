import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Space } from "antd";
import Menu from "./Menu";
import Navbar from "./Navbar";
// import EmployeeTable from "./EmployeeTable";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalInfo } from "../App";
import { format } from "date-fns";

interface Task {
  MrngTaskID: number;
  projectName: string;
  phaseName: string;
  module: string;
  task: string;
  estTime: string;
  upWorkHrs: string;
  employeeID: string;
  currDate: string;
}

interface AssignedEmployees {
  EmployeeID: string;
  PhaseAssigneeID: number;
  projectName: string;
  phaseName: string;
  assignedNames: string[]; // add the assignedNames property
}

interface Module {
  modID: number;
  projectName: string;
  phaseName: string;
  modules: string;
}

interface Project {
  ProID: string | number;
  clientName: string;
  projectName: string;
  projectDescription: string;
}

interface Phases {
  phaseID: number;
  projectName: string;
  phases: string[];
}
type Phase = {
  phaseID: number;
  projectName: string;
};

const AddModule: React.FC<any> = ({ navigation, classes }) => {
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [phases, setPhases] = useState<Phases[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [phaseAssignedArr, setPhaseAssignedArr] = useState<AssignedEmployees[]>(
    []
  );

  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [employeeID, setEmployeeID] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const { mrngEditID ,setMrngEditID } = useContext(GlobalInfo);

  const formattedDate = format(currentDate, "yyyy-MM-dd");

  const [morningTask, setMorningTask] = useState<Task>({
    MrngTaskID: 0,
    projectName: "",
    phaseName: "",
    module: "",
    task: "",
    estTime: "",
    upWorkHrs: "",
    employeeID: employeeID,
    currDate: formattedDate,
  });

  console.log(morningTask, "ffffgggghhhh");

  useEffect(() => {
    if (mrngEditID) {
      axios
        .get<Task[]>("http://localhost:5000/get/addTaskMorning")
        .then((response) => {
          const res = response.data.filter((e) => e.MrngTaskID === mrngEditID);

          // const {  } = res[0]

          setMorningTask({
            MrngTaskID: res[0].MrngTaskID,
            projectName: res[0].projectName,
            phaseName: res[0].phaseName,
            module: res[0].module,
            task: res[0].task,
            estTime: res[0].estTime,
            upWorkHrs: res[0].upWorkHrs,
            employeeID: res[0].employeeID,
            currDate: res[0].currDate,
          });



          console.log(res, "bbbbbjjjjjjj-------");
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [mrngEditID]);

  const { getEmpInfo, empInfo, setEmpInfo } = useContext(GlobalInfo);

  console.log(empInfo, "gggggg---");


  const navigate = useNavigate();



  useEffect(() => {

    axios
      .get<AssignedEmployees[]>("http://localhost:5000/get/PhaseAssignedTo")
      .then((response) => {
        console.log(response.data);
        const sortedData = response.data.sort(
          (a, b) => Number(b.PhaseAssigneeID) - Number(a.PhaseAssigneeID)
        );

        setPhaseAssignedArr(sortedData);
        console.log(sortedData, "kkkkooo-----");

        const arr = sortedData
          .map((e) => {
            if (e.EmployeeID === empInfo[0].EmployeeID) {
              return e.projectName;
            }
            return null; // or some other default value
          })
          .filter((value, index, self) => {
            return value !== null && self.indexOf(value) === index;
          })
          .reduce((unique: Array<string>, value: string | null) => {
            if (value !== null && !unique.includes(value)) {
              unique.push(value);
            }
            return unique;
          }, []);

        setProjectNames(arr);
        console.log(arr, "ffffff");
        console.log(morningTask.projectName, "sssss");

        if (morningTask.projectName) {
          const arr = sortedData
            .filter(
              (obj) =>
                obj.projectName === morningTask.projectName &&
                obj.EmployeeID === empInfo[0].EmployeeID
            )
            .map((obj) => obj.phaseName);

          console.log(arr, "zzzzzzz");

          const phasesArr = arr.map((phase, index) => ({
            phaseID: index + 1,
            projectName: morningTask.projectName,
            phases: [phase],
          }));

          setPhases(phasesArr);
        }
      });
  }, [morningTask.projectName]);



  useEffect(() => {

    axios
      .get<Module[]>("http://localhost:5000/get/modules")
      .then((response) => {

        const sortedData = response.data.sort(
          (a, b) => Number(b.modID) - Number(a.modID)
        );

        setModules(sortedData);
      });
  }, []);

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    setMorningTask({
      ...morningTask,
      module: value,
    });
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    const currentPhase = phases.find((phase) => phase.projectName === value);
    if (currentPhase) {
      setSelectedPhase(currentPhase.phases[0]);
      setMorningTask({
        MrngTaskID: 0,
        projectName: value,
        phaseName: currentPhase.phases[0],
        module: "",
        task: "",
        estTime: "",
        upWorkHrs: "",
        employeeID: employeeID,
        currDate: formattedDate,
      });
    } else {
      setSelectedPhase("");
      setMorningTask({
        MrngTaskID: 0,
        projectName: value,
        phaseName: "",
        module: "",
        task: "",
        estTime: "",
        upWorkHrs: "",
        employeeID: employeeID,
        currDate: formattedDate,
      });
    }
  };

  const handlePhaseChange = (value: string) => {
    setSelectedPhase(value);
    setMorningTask({
      ...morningTask,
      phaseName: value,
    });
  };

  const handleTaskChange = (value: string) => {
    setMorningTask({
      ...morningTask,
      task: value,
    });
  };

  const handleEstTimeChange = (value: string) => {
    setMorningTask({
      ...morningTask,
      estTime: value,
    });
  };

  const handleUpWorkHrsChange = (value: string) => {
    setMorningTask({
      ...morningTask,
      upWorkHrs: value,
    });
  };



  const dataString = localStorage.getItem("myData");


  useEffect(() => {
    setEmployeeID(empInfo[0].EmployeeID);
  }, [empInfo[0].EmployeeID]);

  const handleSubmit = () => {
    if (mrngEditID) {
      axios
        .put(
          `http://localhost:5000/update/addMrngTask/${mrngEditID}`,
          morningTask
        )
        .then((response) => {
          console.log(morningTask, "nnnnnnnnnnnnnn");
 if (response.data === "All fields are required.") {
            alert("All fields are required.");
          } else {
            navigate("/view-morning-task");
            setMrngEditID()
          }

          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      axios
        .post("http://localhost:5000/create/addTaskMorning", morningTask)
        .then((response) => {
          console.log(morningTask, "nnnnnnnnnnnnnn");

          if (response.data === "All fields are required.") {
            alert("All fields are required.");
          } else {
            navigate("/view-morning-task");
          }

          console.log(response.data); // log the response message
          // show a success message to the user/*  */
        })
        .catch((error) => {
          console.log(error.response.data); // log the error message
          // show an error message to the user
        });
    }
    // Submit module data to server
  };

  return (
    <div className="emp-main-div">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
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
            <div className="add-div">
              <p className="add-heading">Add Morning Task</p>
              <label className="add-label">
                Project Name<span style={{ color: "red" }}>*</span>
              </label>

              <select
                // onChange={handleChange}
                style={{ width: "95%" }}
                className="add-input"
                id="project"
                name="project"
                value={selectedProject}
                onChange={(e) => handleProjectChange(e.target.value)}
              >
                <option value="">Select a project</option>
                {projectNames.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "95%",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="add-label">
                    Phase<span style={{ color: "red" }}>*</span>
                  </label>
                  {/* {selectedProject &&  ( */}
                  <select
                    className="add-input"
                    id="phase"
                    name="phase"
                    value={selectedPhase}
                    onChange={(e) => handlePhaseChange(e.target.value)}
                  >
                    <option value="">Select a phase</option>
                    {phases
                      .filter((phase) => phase.projectName === selectedProject)
                      .map((phase) => {
                        // console.log(phase, "77777777");

                        return (
                          <React.Fragment key={phase.phaseID}>
                            <option value={phase.phases}>{phase.phases}</option>
                          </React.Fragment>
                        );
                      })}
                  </select>
                  {/* )} */}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label className="add-label">
                    Module<span style={{ color: "red" }}>*</span>
                  </label>

                  {/* {selectedProject && selectedPhase && ( */}
                  <select
                    className="add-input"
                    id="module"
                    name="module"
                    value={selectedModule}
                    onChange={(e) => handleModuleChange(e.target.value)}
                  >
                    <option value="">Select a module</option>
                    {modules
                      .filter((module) => module.phaseName === selectedPhase)
                      .map((module) => {
                        return (
                          <option key={module.modID} value={module.modules}>
                            {module.modules}
                          </option>
                        );
                      })}
                  </select>
                </div>

                {/* )} */}
              </div>

              <div>
                <label className="add-label">
                  task:<span style={{ color: "red" }}>*</span>
                </label>

                <div style={{ width: "89%" }} className="form-control">
                  <textarea
                    style={{
                      outline: "none",
                      border: "none",
                      maxWidth: "100%",
                    }}
                    // type="text"
                    name="task"
                    className="form-control"
                    value={morningTask.task}
                    onChange={(e) => handleTaskChange(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "94%",
                }}
              >
                <div className="form-group">
                  <label className="add-label">
                    Est. time :<span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    style={{ width: "16.8vw" }}
                    name="estTime"
                    className="form-control"
                    value={morningTask.estTime}
                    onChange={(e) => handleEstTimeChange(e.target.value)}
                    required
                  >
                    <option value="">--Select Time--</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) =>
                      [15, 30, 45].map((minute) => (
                        <option
                          key={`${hour}:${minute}`}
                          value={`${hour}:${minute}`}
                        >
                          {`${hour} hours ${minute} mins`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label className="add-label">Upwork Hrs</label>
                  <select
                    style={{ width: "16.8vw" }}
                    name="upWorkHrs"
                    className="form-control"
                    value={morningTask.upWorkHrs}
                    onChange={(e) => handleUpWorkHrsChange(e.target.value)}
                    required
                  >
                    <option value="">--Select Time--</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hour) =>
                      [15, 30, 45].map((minute) => (
                        <option
                          key={`${hour}:${minute}`}
                          value={`${hour}:${minute}`}
                        >
                          {`${hour} hours ${minute} mins`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <button className="add-button" onClick={handleSubmit}>
                Add Task
              </button>
            </div>
            <div
              style={{ marginTop: "50px", height: "80%", width: "100%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModule;

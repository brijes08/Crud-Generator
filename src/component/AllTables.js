import React, { useState, useEffect } from 'react'
import axios from "axios";
import { NavLink } from 'react-router-dom'
import LoadingImg from "../loadinggif.gif"

const AllTables = () => {
  const [tableTitle, setTableTitle] = useState({
    tableName: "",
    columns: [
      {
        name: "",
        type: "",
      },
    ],
    prefix: "",
  });
  const [allTables, setAllTables] = useState([]);
  const [loading, setLoading] = useState(false)

  const handleAddColumn = (e) => {
    e.preventDefault();
    setTableTitle({ ...tableTitle, columns: [...tableTitle.columns, { name: "", type: "", },], });
  };

  const removeColumn = (e, index) => {
    e.preventDefault();
    const filteData = tableTitle.columns.filter((val, id) => { return index !== id; })
    setTableTitle({ ...tableTitle, columns: filteData });
  }

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedColumns = [...tableTitle.columns];
    updatedColumns[index] = { ...updatedColumns[index], [name]: value, };
    setTableTitle({ ...tableTitle, columns: updatedColumns });
  };

  const createTable = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        "https://login-api.web2rise.in/api/create-crud",
        tableTitle,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.message === "Table created successfully") {
        setTableTitle({
          tableName: "",
          columns: [
            {
              name: "",
              type: "",
            },
          ],
          prefix: "",
        });
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getData = async () => {
    setLoading(true)
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        "https://login-api.web2rise.in/api/view-all-crud",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        if (response.data.data) {
          setAllTables(response.data.data);
          setLoading(false)
        }
      } else {
        console.log("Server returned an error:");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);


  return (
    <div className="bodyPartSec">
      <div className="addbtn">
        <NavLink className='create_btn' data-bs-toggle="modal" to="#exampleModalToggle" role="button">Add Tables</NavLink>
      </div>
      <div className="mainSection">
        <div className="row">
          <div className="col-md-12">
            <div className="prfSec">
              <table>
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>All Tables List</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ?
                    <tr>
                      <td></td>
                      <td style={{ textAlign: "center" }}><img src={LoadingImg} alt='loading' /></td>
                      <td></td>
                    </tr>
                    : allTables.map((name, i) => (
                      <tr key={name}>
                        <td>{i + 1}</td>
                        <td>{name}</td>
                        <td><button><i className="fa fa-pencil" aria-hidden="true"></i></button> <button><i className="fa fa-trash" aria-hidden="true"></i></button></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalToggleLabel">Creating Table...</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" >x</button>
              </div>
              <div className="modal-body user_add">
                <div className="form_input">
                  <label><b>Enter Your Table Name<span>*</span></b></label>
                  <input type="text" name="tableName" value={tableTitle.tableName} onChange={(e) =>
                    setTableTitle({
                      ...tableTitle,
                      tableName: e.target.value,
                    })
                  } />
                </div>
                <div className="form_input">
                  <div className="TablesaddFields">
                    <div className="creattable">
                      <label><b>Column Name<span>*</span></b></label>
                    </div>
                    <div className="creattable">
                      <label><b>Column Type<span>*</span></b></label>
                    </div>
                    <div className="action">
                      <label><b>Action</b></label>
                    </div>
                  </div>
                  {tableTitle.columns.map((column, index) => (
                    <div className="TablesaddFields" key={index}>
                      <div className="creattable">
                        <input type="text" name="name" value={column.name} onChange={(e) => handleInputChange(e, index)} />
                      </div>
                      <div className="creattable">
                        <input type="text" name="type" value={column.type} onChange={(e) => handleInputChange(e, index)} />
                      </div>
                      {tableTitle.columns.length === 1 ?
                        <div className="deletetables">
                          <input type="button" defaultValue="X" disabled />
                        </div>
                        :
                        <div className="deletetables">
                          <input type="button" defaultValue="X" onClick={(e) => removeColumn(e, index)} />
                        </div>
                      }
                    </div>
                  ))}
                  <div className="AddTable">
                    <input type="button" defaultValue="Add New Column" onClick={handleAddColumn} />
                  </div>
                </div>
                <div className="form_input">
                  <label><b>Enter Your Prefix Name<span>*</span></b></label>
                  <input type="text" name="prefix" value={tableTitle.prefix} onChange={(e) =>
                    setTableTitle({
                      ...tableTitle,
                      prefix: e.target.value,
                    })
                  } />
                </div>
              </div>
              <div className="modal-footer user_addbtn">
                <button data-bs-dismiss="modal" aria-label="Close" onClick={createTable}> Create Table </button>
              </div>
            </form>
          </div>
        </div>
      </div>


    </div>
  )
}

export default AllTables

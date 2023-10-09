import React, { useEffect, useState } from 'react'
import axios from "axios";
import LoadingImg from "../loadinggif.gif"

const AllAPI = () => {

  const [allPrfxData, setAllPrfxData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableApiData, setTableApiData] = useState([]);
  const [prfxName, setPrfxName] = useState('')
  const [loading, setLoading] = useState(false)
  const [tablesAvailable, setTablesAvailable] = useState(false);

  const getData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        "https://login-api.web2rise.in/api/view-prefix",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        if (response.data.data) {
          setLoading(false)
          setAllPrfxData(response.data.data);
        }
      } else {
        console.log("Server returned an error:");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrfxSelect = async (e) => {
    setLoading(false)
    setTablesAvailable(false)

    if (e.target.value === 'select') {
      setTableApiData([])
      setTableData([])
    } else {
      setPrfxName(e.target.value)
    }
    const prfxsName = e.target.value;
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`https://login-api.web2rise.in/api/view-prefix-crud/${prfxsName}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        setTableData([])
        if (response.data.data) {
          setTableData(response.data.data);
        }
      } else {
        console.log("Server returned an error:");
      }
    } catch (error) {
      if (error) {
        setTableData([])
        setTablesAvailable(true)
      }
    }
  }

  const handleableSelect = async (e) => {
    setLoading(true)
    if (e.target.value === 'select') {
      setLoading(false)
      setTableApiData([])
    } else {
      const tablsName = e.target.value;
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`https://login-api.web2rise.in/api/view-api/${prfxName}/${tablsName}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status >= 200 && response.status < 300) {
          if (response.data.data) {
            setLoading(false)
            setTableApiData(response.data.data);
          }
        } else {
          console.log("Server returned an error:");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    getData();
  }, []);

  return (
    <div className="bodyPartSec">
      <div className="top_hdr">
        <div className='selectionBx'>
          <select onChange={(e) => handlePrfxSelect(e)}>
            <option value="select">Select Prefix</option>
            {allPrfxData.map((name, i) => (
              <option key={i} value={name}>{name}</option>
            ))}
          </select>

          <select onChange={(e) => handleableSelect(e)}>
            <option value="select">Select Table</option>
            {!tablesAvailable ? tableData.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))
              :
              <option disabled>No tables available for the selected prefix</option>
            }
          </select>
        </div>
      </div>
      <div className="mainSection">
        <div className="row">
          <div className="col-md-12">
            <div className="prfSec">
              <table>
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>All API List</th>
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
                    :
                    tableApiData.length === 0 ?
                      <tr>
                        <td></td>
                        <td style={{ textAlign: "center" }}><h5>Please Select Prefix and Table Name in the Top Left Corner First.</h5></td>
                        <td></td>
                      </tr>
                      :
                      tableApiData.map((name, i) => (
                        <tr key={name}>
                          <td>{i + 1}</td>
                          <td><a target='_blank' rel="noreferrer" href={`https://login-api.web2rise.in${name}`}>https://login-api.web2rise.in{name}</a></td>
                          <td><button><i className="fa fa-pencil" aria-hidden="true"></i></button> <button><i className="fa fa-trash" aria-hidden="true"></i></button></td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllAPI

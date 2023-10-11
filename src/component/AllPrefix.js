import React, { useState, useEffect } from 'react'
import axios from "axios";
import { NavLink } from 'react-router-dom'
import LoadingImg from "../loadinggif.gif"

const AllPrefix = () => {

  const [prfxTitle, setPrfxTitle] = useState({ prefix: "" });
  const [allPrfxData, setAllPrfxData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleField = (e) => {
    setPrfxTitle({ ...prfxTitle, [e.target.name]: e.target.value });
  }

  const createPrefix = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        "https://login-api.web2rise.in/api/create-prefix",
        prfxTitle,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.message === "prefix added successfully") {
        setPrfxTitle({ prefix: "" });
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getData = async () => {
    setLoading(true)
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
          setAllPrfxData(response.data.data);
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
        <NavLink className="create_btn" data-bs-toggle="modal" to="#exampleModalToggle" role="button" onClick={() => setPrfxTitle({ prefix: "" })}>Add Prefix</NavLink>
      </div>
      <div className="mainSection">
        <div className="row">
          <div className="col-md-12">
            <div className="prfSec">
              <table>
                <thead>
                  <tr>
                    <th>brijesh</th>
                    <th>All Prefix List</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {loading?
                  <tr>
                    <td></td>
                    <td style={{ textAlign: "center" }}><img src={LoadingImg} alt='loading' /></td>
                    <td></td>
                  </tr>
                  :
                  allPrfxData.map((name, i) => {
                    return (
                      <tr key={name}>
                        <td>{i + 1}</td>
                        <td>{name}</td>
                        <td><button><i className="fa fa-pencil" aria-hidden="true"></i></button> <button><i className="fa fa-trash" aria-hidden="true"></i></button></td>
                      </tr>
                    )
                  })
                }
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
                <h5 className="modal-title" id="exampleModalToggleLabel">Creating Prefix...</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" >x</button>
              </div>
              <div className="modal-body user_add">
                <div className="form_input">
                  <label><b>Enter Your Prefix Name<span>*</span></b></label>
                  <input type="text" name="prefix" value={prfxTitle.prefix} onChange={handleField} />
                </div>
              </div>
              <div className="modal-footer user_addbtn">
                <button data-bs-dismiss="modal" aria-label="Close" onClick={createPrefix}> Create Prefix </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllPrefix

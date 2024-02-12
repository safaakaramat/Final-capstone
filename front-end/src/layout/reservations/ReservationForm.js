import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, getReservation, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

function ReservationForm({ date }) {
  const history = useHistory();
  const { reservation_id } = useParams(); // This will be undefined for create
  const isEdit = reservation_id ? true : false;

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: date || "",
    reservation_time: "",
    people: 1,
  });
  const [error, setError] = useState(null);

  // Fetch reservation if in edit mode
  useEffect(() => {
    if (isEdit) {
      getReservation(reservation_id)
        .then((loadedReservation) => {
          setReservation({
            ...loadedReservation,
            reservation_date: loadedReservation.reservation_date.split("T")[0], // Format date for input[type=date]
            people: Number(loadedReservation.people), // Ensure 'people' is a number
          });
        })
        .catch(setError);
    }
  }, [isEdit, reservation_id]);

  const handleChange = ({ target }) => {
    setReservation({
      ...reservation,
      [target.name]: target.name === "people" ? Number(target.value) : target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const apiCall = isEdit ? updateReservation : createReservation;
    apiCall(reservation)
      .then(() => history.push(`/dashboard?date=${reservation.reservation_date}`))
      .catch(setError);
  };

  return (
    <>
      <h1>{isEdit ? "Edit" : "Create"} Reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit} className="form-group">

      <div className="row mb-3">
           <div className="col-4 form-group">
             <label className="form-label" htmlFor="first_name">
               First Name
             </label>
             <input
              className="form-control"
              id="first_name"
              name="first_name"
              type="text"
              onChange={handleChange}
              required={true}
              value={reservation.first_name}
            />
            <small className="form-text text-muted"> Enter First Name </small>
          </div>
          <div className="col-4">
            <label className="form-label" htmlFor="last_name">
              Last Name
            </label>
            <input
              className="form-control"
              id="last_name"
              name="last_name"
              type="text"
              onChange={handleChange}
              required={true}
              value={reservation.last_name}
            />
            <small className="form-text text-muted"> Enter Last Name </small>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Mobile Number
            </label>
            <input
              className="form-control"
              id="mobile_number"
              name="mobile_number"
              type="number"
              onChange={handleChange}
              required={true}
              placeholder="(xxx) xxx-xxxx"
              value={reservation.mobile_number}
            />
            <small className="form-text text-muted"> Enter Mobile Number </small>
          </div>
          <div className="col-4 form-group">
            <label className="form-label" htmlFor="mobile_number">
              Party Size
            </label>
            <input
              className="form-control"
              id="people"
              name="people"
              type="number"
              onChange={handleChange}
              required={true}
              value={reservation.people}

            />
            <small className="form-text text-muted"> Enter Party Size </small>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-4 form-group">
          <label>
            Reservation Date
          </label>
          <input
            className="form-control"
            id="reservation_date"
            name="reservation_date"
            type="date"
            onChange={handleChange}
            required={true}
            value={reservation.reservation_date}
          />
          <small className="form-text text-muted"> Enter Reservation Date (Closed on Tuesdays) </small>
          </div>
          <div className="col-4 form-group">
          <label>
            Reservation Time
          </label>
          <input
            className="form-control"
            id="reservation_time"
            name="reservation_time"
            type="time"
            onChange={handleChange}
            required={true}
            value={reservation.reservation_time}
          />
          <small className="form-text text-muted"> Enter Reservation Time </small>
          </div>
        </div>

        <button type="button" onClick={() => history.goBack()} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary mr-2">
          {isEdit ? "Save Changes" : "Submit Reservation"}
        </button>
      </form>
    </>
  );
}

export default ReservationForm;

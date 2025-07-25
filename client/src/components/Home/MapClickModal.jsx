function MapClickModal({ modalStatus, setModalStatus, locationPercentage }) {
  const handleClose = () => {
    setModalStatus(false);
  };

  return (
    modalStatus && (
      <div className="modalOverlayBarChart">
        <div className="modalContentBarChart">
          <button className="exitButton" onClick={handleClose}>
            <i className="fa fa-close"></i>
          </button>
          <h2>Location History</h2>
          <p>
            Overall Location Activity Rate:{" "}
            {Math.round(locationPercentage * 100)}%
          </p>
          <canvas id="dayBarChart" />
        </div>
      </div>
    )
  );
}

export default MapClickModal;

import React, { useState } from "react";
import { useSelector} from "react-redux";
import axios from "axios";
import { useTranslation } from 'react-i18next';




const TransferPoints = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsToTransfer, setPointsToTransfer] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();


  const currentUser = useSelector((state) => state.currentuserreducer);
  const points = useSelector((state) => state.pointsReducer);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMessage("Please enter an email to search.");
      setSelectedUser(null);
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:5000/user/search?email=${searchQuery.trim()}`);
      setSelectedUser(data);
      setMessage("");
    } catch (error) {
      setSelectedUser(null);
      setMessage(
        error.response?.data?.message || "User not found. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedUser) {
      setMessage("Please search for a user and select one to transfer points.");
      return;
    }

    const transferAmount = parseInt(pointsToTransfer);
    if (!transferAmount || transferAmount <= 0) {
      setMessage("Please enter a valid number of points to transfer.");
      return;
    }

    if (points.points < 10) {
      setMessage("You need at least 10 points to make a transfer.");
      return;
    }

    if (transferAmount > points.points) {
      setMessage("You cannot transfer more points than you currently have.");
      return;
    }

    

    setLoading(true);
    try {

      console.log({
        senderId: currentUser?.result.email,
        receiverEmail: selectedUser.email,
        points: transferAmount,
      });

      const response = await axios.post(`http://localhost:5000/user/transfer`, {
        senderId: currentUser?.result.email,
        receiverEmail: selectedUser.email,
        points: transferAmount,
      });


      console.log("API Response:", response);

      if (response.status === 200 || response.data.success) {
        setMessage("Points transferred successfully.");
      } else {
        setMessage(response.data.message || "Transfer failed. Try again.");
      }

      setPointsToTransfer("");
      setSelectedUser(null);

    } catch (error) {
      console.error("Transfer Error:", error.response?.data);
      setMessage(error.response?.data?.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-points-container">
      <h1 className="text-2xl font-bold mb-4">{t('Transfer Points')}</h1>
      <p className="text-gray-700 mb-6">{t('Your current points')}: {points.points}</p>

      <div className="search-section mb-6">
        <input
          type="text"
          placeholder={t('Enter email ID to search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full mb-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? t("Searching...") : t("Search")}
        </button>
      </div>

      {selectedUser && (
        <div className="selected-user mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {t('Selected User')}: {selectedUser.name} ({selectedUser.email})
          </h3>
          <input
            type="number"
            placeholder={t('Enter points to transfer')}
            value={pointsToTransfer}
            onChange={(e) => setPointsToTransfer(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full mb-2"
          />
          <button
            onClick={handleTransfer}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            disabled={
              loading || !pointsToTransfer || parseInt(pointsToTransfer) <= 0
            }
          >
            {loading ? t("Transferring...") : t("Transfer Points")}
          </button>
        </div>
      )}

      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
};


export default TransferPoints;

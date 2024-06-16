import React, { useEffect, useState } from 'react';

const Profile = ({ contract, account }) => {
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        const loadProfileData = async () => {
            if (contract && account) {
                try {
                    const userPoints = await contract.methods.getPoints().call({ from: account });
                    setPoints(userPoints);
                } catch (error) {
                    console.error('Error fetching points:', error);
                } finally {
                    setLoading(false); // Setelah selesai, berhenti loading
                }
            }
        };

        loadProfileData();
    }, [contract, account]);

    if (loading) {
        return <p>Loading...</p>; // Tampilkan pesan loading jika sedang memuat data
    }

    return (
        <div className="profile">
            <h2>Profile</h2>
            <p>Address: {account}</p>
            <p>Points: {points}</p>
        </div>
    );
};

export default Profile;

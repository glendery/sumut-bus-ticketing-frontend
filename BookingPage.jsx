import React, { useState, useEffect } from 'react';
import SeatSelection from './SeatSelection';

const BookingPage = () => {
  const [nomorKursi, setNomorKursi] = useState(null);
  const [kursiTerisi, setKursiTerisi] = useState([]); // Awalnya kosong
  const [loading, setLoading] = useState(true);

  // Ganti dengan data rute/tanggal yang sedang dipilih user
  const selectedRoute = "Medan - Sibolga";
  const selectedDate = "2025-12-09"; 

  // --- FUNGSI OTOMATIS: Ambil Data Kursi dari Database ---
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setLoading(true);
        // Panggil API Backend yang baru kita buat
        // Pastikan URL backend sesuai (localhost:5000 atau URL Vercel kamu)
        const response = await fetch(`https://sumut-bus-ticketing-backend.vercel.app/api/seats?date=${selectedDate}&destination=${selectedRoute}`);
        const data = await response.json();

        if (data.success) {
          setKursiTerisi(data.bookedSeats); // Update state dengan data asli DB
        }
      } catch (error) {
        console.error("Gagal mengambil data kursi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSeats();
  }, [selectedRoute, selectedDate]); // Jalankan ulang jika rute/tanggal berubah

  return (
    <div className="main-container">
      <h2 className="section-title">Pilih Kursi ({selectedRoute})</h2>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* BAGIAN KIRI: Layout Kursi */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {loading ? (
            <p>Memuat ketersediaan kursi...</p>
          ) : (
            <SeatSelection 
              layoutType="bus" 
              bookedSeats={kursiTerisi} // Data ini sekarang ASLI dari Database!
              onSeatSelect={(nomor) => setNomorKursi(nomor)} 
            />
          )}
        </div>

        {/* BAGIAN KANAN: Ringkasan */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="ticket-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <h3>Ringkasan Pesanan</h3>
            
            <div className="form-group" style={{ width: '100%' }}>
              <label className="form-label">Nomor Kursi</label>
              <input 
                type="text" 
                className="input-box" 
                value={nomorKursi ? `Kursi No. ${nomorKursi}` : "Belum dipilih"} 
                readOnly 
                style={{ background: '#f1f5f9', fontWeight: 'bold', color: '#1E3A8A' }}
              />
            </div>
            
            <p className="ticket-desc">
              Silakan selesaikan pembayaran setelah memilih kursi.
            </p>
            
            <button 
              className="btn-select" 
              style={{ width: '100%', marginTop: '10px' }}
              disabled={!nomorKursi} 
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingPage;
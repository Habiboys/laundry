const { User, Alamat, Layanan, Pemesanan } = require("../models/index");
const jarak = require('./ongkir');
const moment = require('moment');
const midtransClient = require('midtrans-client'); 

const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    const address = await Alamat.findAll({
      where: {
        userId: req.session.userId,
      },
    });
    res.render("user/profile", { user, address });
  } catch (error) {
    console.error("Error loading profile:", error);
    res.status(500).send("Terjadi kesalahan dalam memuat profil pengguna");
  }
};

const home = async (req, res) => {
  const user = await User.findByPk(req.session.userId);
  const layanans = await Layanan.findAll();
  if (!layanans) {
    res.send("tidak ada layanan");
  }
  res.render("user/home", { user, layanans });
};

const createAddress = (req, res) => {
  res.render("user/alamat");
};

const storeAddress = async (req, res) => {
  const { address, latitude, longitude } = req.body;

  try {
    await Alamat.create({
      alamat: address,
      latitude: latitude,
      longitude: longitude,
      userId: req.session.userId,
    });

    console.log("Data Lokasi Diterima:");
    console.log("Alamat:", address);
    console.log("Koordinat Latitude:", latitude);
    console.log("Koordinat Longitude:", longitude);

    return res.redirect("/profile");
  } catch (error) {
    console.error("Error storing address:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan dalam menyimpan data lokasi" });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const alamat = await Alamat.findByPk(id);
  await alamat.destroy();
  res.redirect("/profile");
};

const layanan = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(req.session.userId);
  const layanan = await Layanan.findByPk(id);
  const address = await Alamat.findAll({
    where: {
      userId: user.id,
    },
  });

  res.render("user/order", { user, layanan, address });
};
const pembulatan = (value, nearest) => {
  return Math.ceil(value / nearest) * nearest;
};

const order = async (req, res) => {
  const { layananId, alamatId } = req.body;

  try {
    const alamatUser = await Alamat.findByPk(alamatId);
    const lokasiLaundry = {
      latitude:    -0.9150200642195505,
      longitude: 100.35364438372059,
    };
 

    const distance = await jarak(
      {
        latitude: alamatUser.latitude,
        longitude: alamatUser.longitude,
      },
      lokasiLaundry
    );

  
    let ongkir = (distance / 1000) * 5000;

    ongkir = pembulatan(ongkir, 100);

    const newPemesanan = await Pemesanan.create({
      userId: req.session.userId,
      layananId: layananId,
      alamatId: alamatId,
      tanggal: new Date(),
      status: "menunggu",
      ongkir: ongkir, // save the delivery fee if needed
    });

    console.log("Pemesanan baru dibuat:", newPemesanan.id);

    res.redirect(`/pesanan/${newPemesanan.id}`);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Terjadi kesalahan dalam membuat pesanan");
  }
};




const batalkanPesanan = async (req,res)=>{
  const order = await Pemesanan.findByPk(req.params.id)
  await order.destroy();
  res.redirect('/home')
}

const pesanan = async (req, res) => {
  const { id } = req.params;
  const order = await Pemesanan.findByPk(id,
    {
      include:[Alamat, Layanan]
    }
  );
  if(!order){
    res.redirect('/home');
  }
  
  const formattedDate = moment(order.tanggal).format('DD MMMM YYYY, HH:mm');

  const user = await User.findByPk(req.session.userId);
  res.render("user/pesanan",{ order, user,  formattedDate});
};

const daftarPesanan = async (req,res) => {

  const orders = await Pemesanan.findAll({
    where:{
    userId: req.session.userId
  },
  include:[Layanan, Alamat]
  });
  const user = await User.findByPk(req.session.userId);
  res.render("user/daftarpesanan",{ orders, user});

}
const createMidtransPayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Pemesanan.findByPk(orderId);

    if (!order) {
      return res.status(404).send('Pesanan tidak ditemukan');
    }

    if (!order.totalHarga) {
      return res.status(400).send('Total harga pesanan tidak valid');
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: 'SB-Mid-server-J5fY9PYLPHKtqFgAieIycNpg',
      clientKey: 'SB-Mid-client-F0crCerdomsPDiZ8'
    });

    const transactionDetails = {
      transaction_details: {
        order_id: `ORDER-${order.id}`,
        gross_amount: parseInt(order.totalHarga)
      },
      credit_card: {
        secure: true
      }
    };

    const transaction = await snap.createTransaction(transactionDetails);
    
    // Update status pembayaran menjadi 'sudah' setelah transaksi berhasil dibuat
    order.bayar = 'sudah';
    await order.save();
    
    console.log(`Status pembayaran untuk pesanan ${orderId} diubah menjadi 'sudah'.`);

    // Redirect ke halaman pembayaran Midtrans
    res.redirect(transaction.redirect_url);

  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);
    res.status(500).send('Terjadi kesalahan dalam pembuatan transaksi Midtrans');
  }
};
const midtransCallbackHandler = async (req, res) => {
  try {
    const orderId = req.body.order_id.replace('ORDER-', ''); // Hapus prefix 'ORDER-'
    const transactionStatus = req.body.transaction_status;

    console.log(`Received callback for order ${orderId} with status ${transactionStatus}`);

    // Proses berbagai status transaksi
    if (['capture', 'settlement', 'success'].includes(transactionStatus)) {
      const order = await Pemesanan.findByPk(orderId);

      if (order && order.bayar !== 'sudah') {
        order.bayar = 'sudah';
        await order.save();
        console.log(`Status pemesanan ${orderId} diperbarui menjadi 'sudah'.`);
      } else {
        console.log(`Pemesanan dengan ID ${orderId} tidak ditemukan atau sudah dibayar.`);
      }
    } else {
      console.log(`Transaksi untuk order ${orderId} belum berhasil. Status: ${transactionStatus}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling Midtrans callback:', error);
    res.status(500).send('Terjadi kesalahan dalam pemrosesan callback Midtrans');
  }
};


module.exports = {
  profile,
  createAddress,
  storeAddress,
  deleteAddress,
  home,
  layanan,
  order,
  pesanan,
  daftarPesanan,
  batalkanPesanan,
  createMidtransPayment,
  midtransCallbackHandler,

 
};

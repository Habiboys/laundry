const { User, Alamat, Layanan, Pemesanan } = require("../models/index");
const { Op } = require('sequelize');

const dashboard = async (req, res) => {
    res.render('admin/dashboard', {
        title: "Dashboard"
    });
}


const pesananDiproses = async (req, res) => {
    try {
        const order = await Pemesanan.findAll({
            where: {
                [Op.or]: [
                    { status: 'dikonfirmasi' },
                    { status: 'diproses' },

                ]
            },
            include: [User, Alamat, Layanan]
        });

        res.render('admin/pesanandiproses', {
            title: "Pesanan Diproses",
            order
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
}
const pesananSelesai = async (req, res) => {
    const order = await Pemesanan.findAll({
        where: {
            [Op.or]: [
                { status: 'diantar' },
                { status: 'selesai' },

            ]
        },
        include: [User, Alamat, Layanan]
    });

    res.render('admin/pesananselesai', {
        title: "Pesanan Selesai",
        order
    });
}




const tambahBerat = async (req, res) => {
    try {
      const { berat } = req.body; // Mengambil berat dari body request
      const order = await Pemesanan.findByPk(req.params.id, {
        include: Layanan
      });
  
      if (!order) {
        return res.status(404).send("Pesanan tidak ditemukan");
      }
  
      const costLayanan = order.Layanan.harga;
      const harga = berat * costLayanan;
      const totalHarga = harga + order.ongkir;

  
      order.berat = berat;
      order.harga = harga;
      order.totalHarga = totalHarga;
      order.status= "diproses";
  
      await order.save();
  
      res.redirect("/admin/pesanan-diproses");
    } catch (error) {
      console.error("Error updating order weight:", error);
      res.status(500).send("Terjadi kesalahan dalam memperbarui berat pesanan");
    }
  };

  const antar= async (req,res)=>{
    const order = await Pemesanan.findByPk(req.params.id,
      {
        where:
        {
          bayar:'sudah'
        }
      }
    );
    if(!order){
        res.send("Pesanan tidak ditemukan");
    }
    order.status= 'diantar'
    await order.save();
    res.redirect('/admin/pesanan-diproses')
  }

  const selesaiAntar= async(req,res)=>{
    const order = await Pemesanan.findByPk(req.params.id,
        {
          where:
          {
           status: 'diantar'
          }
        }
      );
      if(!order){
          res.send("Pesanan tidak ditemukan");
      }
      order.status= 'selesai'
      await order.save();
      res.redirect('/admin/pesanan-selesai')
  }
module.exports = {
    dashboard,
    pesananDiproses,
    pesananSelesai,
    tambahBerat,
    antar,
    selesaiAntar
}

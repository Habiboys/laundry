const bcrypt = require("bcryptjs");
const { User } = require("../models/index");

const formRegis = async(req,res)=>{
 res.render('register');
}

const register = async(req,res)=>{
    const { username, email, password, phone} = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const user = await User.create({ username, email, password: hashedPassword, hp: phone });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
    // redirect
}

const formLogin = async(req,res)=>{
 res.render('login');
}
const login = async(req,res)=>{
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { error: 'Username atau password salah' });
        }

        req.session.userId = user.id;
        req.session.userRole = user.role;
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.render('login', { error: 'Terjadi kesalahan, silakan coba lagi' });
            }
            if (user.role=='admin'){
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/home');
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'Terjadi kesalahan, silakan coba lagi' });
    }
}

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Session destruction error:', err);
        }
        res.redirect('/auth/login');
    });
};
  
module.exports={
formRegis,
register,
formLogin,
login,
logout
}
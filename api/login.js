const db = require('./DataHandler');

const valid_info = () => (req, res, next) => {
    console.log('login', req.body);
    const {name, password} = req.body;
    const login_success = checkID_PW(name, password);

    if (login_success) {
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 30);
        const randomInt = +new Date();
        db.get('session').push({sessionId: randomInt, name: name, expires: expires}).write();
        res.writeHead(302, {
            Location    : '/todo',
            'Set-Cookie': `session=${randomInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
        });
        res.end();
    }
};

const checkID_PW = (login_user_id, login_user_pw) => {
    const user_info = db.get('users').find({'id': login_user_id}).value();
    if (user_info === undefined || user_info.id !== login_user_id) return false;
    else return user_info.pw === login_user_pw;
};


module.exports = {
    valid_info,
};
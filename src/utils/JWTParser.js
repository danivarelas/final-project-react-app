import jwt from 'jsonwebtoken';

const validate = (token) => {
    try {
        var decoded = jwt.verify(token, 'secret', { algorithms: ['HS256'] });
        return { id: decoded.jti, name: decoded.name, username: decoded.username};
    } catch (err) {
        return null;
    }
}

export default validate;
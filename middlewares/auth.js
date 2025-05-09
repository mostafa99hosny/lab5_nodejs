const jwt =require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    const{ authorization } = req.headers;
    if(!authorization){
        return res.status(401).json({
            status: 'fail',
            message: 'Authorization header is missing'
        });
    }

    try{
        let decoded=jwt.verify(authorization, process.env.SECRET);

        // console.log(decoded);
        req.userId=decoded.id;
        req.role=decoded.role;
        next();
    }

    catch(err){
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid token'
        });
    }
    
}


exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.role)){
            return res.status(403).json({
                status: 'fail',
                message: 'You do not have permission to perform this action'
            });
        }else{
            next();
        }
    }
} 
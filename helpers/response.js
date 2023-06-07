const successResponse = (res, data, msg = 'Successful', code = 200) => {
    return res.status(code).json({ success: true, message: msg, contacts: data })
}
const errorResponse = (res, data, msg = 'Something went wrong', code = 500) => {
    console.log(msg);
    return res.status(code).json({ success: false, message: msg, error: data })
}
module.exports = {
    successResponse,
    errorResponse
}
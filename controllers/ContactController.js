const { errorResponse, successResponse } = require('../helpers/response');
const ContactModel = require('../models/contact.model')
class ContactController {

    getContacts = async (req, res) => {
        try {
            let result = await ContactModel.getContacts(req.body);
            successResponse(res, result);
        } catch (error) {
            return errorResponse(res, error, error.message);
        }
    }
}
module.exports = new ContactController()
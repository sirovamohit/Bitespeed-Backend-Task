class ContactModel {
    getContacts = async (data) => {
        var date = Date.now();
        let result_data = {};
        result_data.primaryContatctId = 0;
        result_data.secondaryContactIds = [];
        result_data.phoneNumbers = [];
        result_data.emails = [];
        if(data.phoneNumber && data.email){
            let query = "SELECT * FROM Contact WHERE (phoneNumber = ?)";
            let phoneExists =  await DB.query(query, [data.phoneNumber], 0);
            let query1 = "SELECT * FROM Contact WHERE (email = ?)";
            let emailExists =  await DB.query(query1, [data.email], 0);
            if(phoneExists.length && emailExists.length){
                return this.getdata(data);
            }
            else if(phoneExists.length || emailExists.length) { 
                let id;
                if(phoneExists.length) id = phoneExists[0].linkedId || phoneExists[0].id;
                else id = emailExists[0].linkedId || emailExists[0].id;
            
                let query =   `INSERT INTO Contact (phoneNumber,email,linkedId,updatedAt,linkPrecedence) VALUES (?,?,?,?,'secondary');`
                await DB.query(query, [data.phoneNumber,data.email,id,date], 0); 
                if(phoneExists.length) {
                    data.email = phoneExists[0].email;
                    data.phoneNumber = phoneExists[0].phoneNumber;
                }
                else {
                     data.phoneNumber = emailExists[0].phoneNumber;
                     data.email = emailExists[0].email;
                }
                return this.getdata(data);
            }else{
               return  this.insertNew(data);
            }
        }
        else{
            let query = "SELECT * FROM Contact WHERE (phoneNumber = ?  OR email = ?)";
            let userExists =  await DB.query(query, [data.phoneNumber,data.email], 0);
            if(userExists){
                data.phoneNumber = userExists[0].phoneNumber;
                data.email = userExists[0].email;
                return this.getdata(data);
            }
            else{
                return  this.insertNew(data);
            }
        }
    }
    getdata = async(data) => {
        let result_data = {};
        result_data.secondaryContactIds = [];
        result_data.phoneNumbers = [];
        result_data.emails = [];
        let query = "SELECT * FROM Contact WHERE (phoneNumber = ?  OR email = ?)";
        let userExists1 =  await DB.query(query, [data.phoneNumber,data.email], 0);
        let Id =  userExists1[0].linkedId || userExists1[0].id;
        let query1 = "SELECT * FROM Contact WHERE (linkedId = ? OR id = ?)";
        let userExists =  await DB.query(query1, [Id,Id], 0);
        
        for (let i = 0; i < userExists.length; i++) {
            if(userExists[i].linkPrecedence == 'primary'){
                result_data.primaryContatctId = userExists[i].id;
                if(!result_data.phoneNumbers.includes(userExists[i].phoneNumber)) {
                    result_data.phoneNumbers.push(userExists[i].phoneNumber)
                }
                if(!result_data.emails.includes(userExists[i].email)) {
                    result_data.emails.push(userExists[i].email)
                }
            }

        }
        for (let i = 0; i < userExists.length; i++) {
            if(userExists[i].linkPrecedence == 'secondary'){
                result_data.secondaryContactIds.push(userExists[i].id);
                if(!result_data.phoneNumbers.includes(userExists[i].phoneNumber)) {
                    result_data.phoneNumbers.push(userExists[i].phoneNumber)
                }
                if(!result_data.emails.includes(userExists[i].email)) {
                    result_data.emails.push(userExists[i].email)
                }
            }
        }
        return result_data;
    }
    insertNew = async(data) =>{
        var date = Date.now();
        let result_data = {};
        result_data.primaryContatctId = 0;
        result_data.secondaryContactIds = [];
        result_data.phoneNumbers = [];
        result_data.emails = [];
        let query =   `INSERT INTO Contact (phoneNumber,email,updatedAt,linkPrecedence) VALUES (?,?,?,'primary');`
        await DB.query(query, [data.phoneNumber,data.email,date], 0);
        let query1 = 'SELECT * FROM Contact WHERE phoneNumber = ?  OR email = ?';
        let result = await DB.query(query1, [data.phoneNumber,data.email], 0);
        result_data.primaryContatctId = result[0].id;
        result_data.phoneNumbers.push(result[0].phoneNumber);
        result_data.emails.push(result[0].email);
        return result_data;
    }

}
module.exports = new ContactModel();
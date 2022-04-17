const profileModel = require('../models/profileSchema')
module.exports = {
    getGetUser: (userID) => {
        return profileModel.findOne({ userID })
    },
    updateUser: async (userID, body) => {
        const { cash } = body

        if (cash) {
            delete body.cash

            body['$inc'] = { cash }
        }
        console.log(userID, body)
        return profileModel.findOneAndUpdate({ userID }, body)
    },
}

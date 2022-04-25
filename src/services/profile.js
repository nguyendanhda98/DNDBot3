const profileModel = require('../models/profileSchema')
module.exports = {
    getGetUser: (userID) => {
        return profileModel.findOne({ userID })
    },
    updateUser: async (userID, body) => {
        const { cash, bank } = body

        const inc = {}

        if (cash) {
            delete body.cash
            inc.cash = cash
        }

        if (bank) {
            delete body.bank
            inc.bank = bank
        }

        if (Object.keys(inc).length > 0) {
            body['$inc'] = inc
        }

        return profileModel.findOneAndUpdate({ userID }, body)
    },
}

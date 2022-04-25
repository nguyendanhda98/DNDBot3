const db = require('./src/db')
db.get('posts')
    .push({
        id: 1,
        title: 'tại sao Tào Tháo lại là gian hùng?',
        isPublish: false,
        view: 0,
        cai_nay_de_xoa: 'No beer, no life',
    })
    .write()

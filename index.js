const DB = require('./db');
const db = new DB()

const MESSAGES = (gid) => {
    return `groups/${gid}/messages`
}


db.update('meta/lastopen', Date.now())
.then(res => {
    console.log(res.message)
})

/*example */
//get route
const text_message = {
    name: 'Noah Schairer',
    email: 'nschairer@gmail.com',
    text: "Yo what's up",
    date: Date.now(),
    gid: 'x-;in;lsdafijpo'
}
db.write(MESSAGES(text_message.gid), text_message)
.then(result => {
    console.log(result.message)
})

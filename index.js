const DB = require('./db');
const db = new DB()

//dynamic ref
const MESSAGES = (gid) => {
    return `groups/${gid}/messages`
}

//Save last access date
db.update('meta/lastopen', Date.now())
.then(res => {
    console.log(res.message)
})

/*example */
const text_message = {
    name: 'Noah Schairer',
    email: 'nschairer@gmail.com',
    text: "Yo what's up",
    date: Date.now(),
    gid: 'x-;in;lsdafijpo',
}
//write message with unique id
db.write(MESSAGES(text_message.gid), text_message)
.then(result => {
    console.log(result.message)
})
//get all messages from group
const messages = db.get(MESSAGES(text_message.gid))

//update all messages provider to verizon
let keyToRemove;

for (let key in messages) {
    //loop through and save the last key for later
    keyToRemove = key

    //update each message provider
    db.update(`groups/${text_message.gid}/messages/${key}/provider`, 'Verizon')
    .then(result => {
        console.log(result.message)
    })
}

//delete the last message with the key we saved
db.remove(`groups/${text_message.gid}/messages/${keyToRemove}`)
.then(result => {
    console.log(result.message)
})
